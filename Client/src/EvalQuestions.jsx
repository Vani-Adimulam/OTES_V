import axios from "axios";
import { useEffect, useState, useContext } from "react";
import './EvalQuestions.css'
import { useLocation, useNavigate } from "react-router";
import { ATS_URL, BASE_URL } from "./Service/helper";
import { Button } from "react-bootstrap";
import DOMPurify from "dompurify";
import { store } from "./App";


const EvalQuestions = () => {
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState([]);
  const [mcqQuestions, setMCQQuestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [candidate, setCandidate] = useState([]);
  const [result, setResult] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);


  let mcqScore = 0;
  let correctAnswers = 0;
  let wrongAnswers = 0;

  const location = useLocation();
  console.log(location)
  const email = location.state.email;
  const eval_email = location.state.eval_email;
  const testStatus = location.state.testStatus;
  const isEvaluated = testStatus === 'Evaluated';
  const [token, setToken] = useContext(store) || localStorage.getItem("token")

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!token && !storedToken) {
      navigate("/login");
    } else if (!token && storedToken) {
      setToken(storedToken);
    }
  }, [token, navigate, setToken]);
  useEffect(() => {
    axios.get(`${BASE_URL}/getTestResults?emails=${email}`)
      .then(response => {
        setTestResults(response.data);
        const selectedAnswers = response.data[0].selectedAnswers;
        const totalQuestions = Object.keys(selectedAnswers).length;
        setTotal(totalQuestions);
      })
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    axios.get(`${BASE_URL}/getCandidateDetails/${email}`)
      .then(response => {
        // console.log(response.data[0]);
        setCandidate(response.data[0]);
        console.log(candidate);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (testResults.length > 0) {
      const selectedAnswersIds = testResults.flatMap(result =>
        Object.keys(result.selectedAnswers)
      );
      axios
        .get(`${BASE_URL}/getMCQQuestions`, {
          params: {
            ids: selectedAnswersIds.join(",")
          }
        })
        .then(response => {
          const questionsWithImage = response.data.map(question => {
            if (question.image && question.image.data) {
              const base64Image = question.image.data;
              question.imageURL = `data:${question.image.contentType};base64,${base64Image}`;
            }
            question.question = DOMPurify.sanitize(question.question);
            return question;
          });
          setMCQQuestions(questionsWithImage);
        })
        .catch(error => console.error(error));
    }
  }, [testResults]);  

  useEffect(() => {
    if (isEvaluated) {
      // Disable the Evaluate button
      const testResult = location.state.result;
      console.log(testResult)
      console.log(result)
      const PassButton = document.getElementById('evaluate-pass');
      const FailButton = document.getElementById('evaluate-fail');
      const OnHoldButton = document.getElementById('evaluate-OnHold');

      if (testResult === "Pass") {
        if (FailButton) {
          FailButton.parentNode.removeChild(FailButton);
        }
        PassButton.disabled = true;
        if (OnHoldButton) {
          OnHoldButton.parentNode.removeChild(OnHoldButton)
        }
      }
      if (testResult === "Fail") {
        if (PassButton) {
          PassButton.parentNode.removeChild(PassButton);
        }
        FailButton.disabled = true;
        if (OnHoldButton) {
          OnHoldButton.parentNode.removeChild(OnHoldButton)
        }
      }
      if (testResult === "On Hold") {
        if (PassButton) {
          PassButton.parentNode.removeChild(PassButton);
        }
        if (FailButton) {
          FailButton.parentNode.removeChild(FailButton);
        }
        OnHoldButton.disabled = true;
      }


    }
  }, [isEvaluated]);

  function handleProfileClick() {
    let email = eval_email;
    navigate("/myprofiledashboard", { state : { email : email }});
  }

  async function updateCandidateResult(result, email) {
    try {
      const response = await fetch(
        `${BASE_URL}/updateTestResult/${email.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            result,
            mcqScore
            // ,codeScore,
            // textScore,
            // totalScore,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update candidate result.");
      }

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //****** Update the test result to Applicant Tracking System 
  const submitTestResultToAts =async (appResult,mcqScore,total,other)=>{
       ///Post the data to the Applicant Tracking System when applicant completed the test
      try {
        await axios.put(`${ATS_URL}/appicant/update/comments`, { email: email, comment: `The applicant's evaluation has been completed successfully. The obtained result is: ${appResult}, with a score of ${mcqScore} out of ${total}.${other} `, commentBy: "TES System", cRound: "Online Assessment Test", nextRound: "Veera", status: "Hiring Manager" })
          .then(res => console.log(res))
      } catch (err) {
        console.log(err.message)
      }
  }
  ///// Update the test result to Applicant Tracking System 


  return (
    <div style={{ marginTop: '90px' }}>
      <header className="bg-#D6D6D6 text-dark p-3">
        <h1>Test Evaluation</h1>
      </header>
      <div style={{ display: "flex", justifyContent: "end" }}>
        <button
          className="btn"
          style={{ backgroundColor: "#015D88", fontFamily: "fantasy" }}
          onClick={handleProfileClick}
        >
          Back To Dashboard
        </button>
      </div>
      <h1 style={{ backgroundColor: '#f8f9fa' }}>Candidate: {email}</h1>
      <ol style={{ paddingLeft: "0", marginTop: "30px" }}>
        {mcqQuestions.map((question) => {
          const selectedAnswer = testResults[0].selectedAnswers[question._id];
          console.log(selectedAnswer)
          const isCorrect = selectedAnswer === question.correct_choice;
          const isNotAnswered = testResults[0].selectedAnswers[question._id];

          if (isCorrect) {
            mcqScore++;
            correctAnswers++;
          } else {
            wrongAnswers++;
          }
          return (
            <li key={question._id} style={{ marginBottom: "30px" }}>
              <div className="card">
                <div className="card-body">
                <h3 dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.question) }} /> 
                {question.imageURL && (
                  <div className="card-body">
                    <img src={question.imageURL} alt="Question Image" style={{ width: 'auto', height: 'auto' }} />
                  </div>
                  )}
                  <p style={{ marginBottom: "10px" }}>
                    Correct answer: {question.correct_choice}
                  </p>
                  <div className="form-check" style={{ marginBottom: "10px" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name={question._id}
                      value={1}
                      defaultChecked={selectedAnswer === "1"}
                    />
                    <label className="form-check-label">{question.choice1}</label>
                  </div>
                  <div className="form-check" style={{ marginBottom: "10px" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name={question._id}
                      value={2}
                      defaultChecked={selectedAnswer === "2"}
                    />
                    <label className="form-check-label">{question.choice2}</label>
                  </div>
                  <div className="form-check" style={{ marginBottom: "10px" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name={question._id}
                      value={3}
                      defaultChecked={selectedAnswer === "3"}
                    />
                    <label className="form-check-label">{question.choice3}</label>
                  </div>
                  <div className="form-check" style={{ marginBottom: "20px" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name={question._id}
                      value={4}
                      defaultChecked={selectedAnswer === "4"}
                    />
                    <label className="form-check-label">{question.choice4}</label>
                  </div>
                  <span id={`symbol-${question._id}`} className="symbol">
                    {isNotAnswered !== "" ? isCorrect ? (
                      <span
                        style={{
                          color: "#28a745",
                          fontWeight: "bold",
                          marginRight: "5px",
                        }}
                      >
                        &#10004; Correct
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "#dc3545",
                          fontWeight: "bold",
                          marginRight: "5px",
                        }}
                      >
                        &#10008; Wrong
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "#e08e36",
                          fontWeight: "bold",
                          marginRight: "5px",
                        }}
                      >
                        &#8709; Not Answered
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
        <h4 style={{ display: 'flex', justifyContent: 'space-around' }}>
          <span>Correct Answers: {correctAnswers}</span>
          <span>Wrong Answers: {wrongAnswers}</span>
          <span>Score: {mcqScore} / {total}</span>
        </h4>

      </ol>
      <center>
        <div>
          {/* <button
            type="submit"
            className="btn"
            id={`evaluate-all`}
            style={{ backgroundColor: "#A4B3C4" }}
            onClick={() => {
              console.log('mcqscore:', mcqScore);
              console.log('total marks', mcqScore);
              // Navigate to the summary page
              navigate('/summary', {
                state: {
                  email,
                  mcqScore,
                  totalScore: mcqScore,
                  total: total,
                },
              });

              


            }}
          >
            Evaluate
          </button> */}

          <Button
            id={`evaluate-pass`}
            variant="success"
            style={{ marginRight: "10px" }}
            onClick={() => {
              setResult("Pass");
              updateCandidateResult("Pass", { email });
              setIsButtonClicked(true);
              submitTestResultToAts("<b> Pass </b>",mcqScore,total,"")
              navigate("/CandidateList");
              window.location.reload();
            }}
            disabled={isButtonClicked}
          >
            Pass
          </Button>
          <Button
            id={`evaluate-OnHold`}
            variant="warning"
            onClick={() => {
              setResult("On Hold");
              updateCandidateResult("On Hold", { email });
              setIsButtonClicked(true);
              submitTestResultToAts(`<b> On Hold </b>`,mcqScore,total,`To determine whether the applicant passes or fails, please click the following link: <a href="${window.location.origin}" target="_blank">Click Here</a>`)
              navigate("/CandidateList");
              window.location.reload();
            }}
            style={{ marginRight: "10px" }}
            disabled={isButtonClicked}
          >
            On Hold
          </Button>

          <Button
            id={`evaluate-fail`}
            variant="danger"
            onClick={() => {
              setResult("Fail");
              updateCandidateResult("Fail", { email });
              setIsButtonClicked(true);
              submitTestResultToAts("<b> Fail <b>",mcqScore,total,"")
              navigate("/CandidateList");
              window.location.reload();
            }}
            disabled={isButtonClicked}
          >
            Fail
          </Button>

        </div>
      </center>
    </div>
  );
};

export default EvalQuestions;
