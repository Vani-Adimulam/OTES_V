// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { BASE_URL } from '../Service/helper';
// import DOMPurify from 'dompurify';
// import {toast} from 'react-toastify';


// const getMCQQuestionsForTest = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false)
//   const [isLoading, setIsLoading] = useState(false);
//   const [mcqquestions, setMCQQuestions] = useState(
//     JSON.parse(localStorage.getItem('mcqquestions')) || []
//   );
//   const [selectedAnswers, setSelectedAnswers] = useState(
//     JSON.parse(localStorage.getItem('selectedAnswers')) || {}
//   ); 
//   const [hasFetched, setHasFetched] = useState(
//     localStorage.getItem('hasFetched') || false
//   );
//   const email = JSON.parse(localStorage.getItem('email'));
//   const atsId = JSON.parse(localStorage.getItem('Id'));
//   console.log(atsId)

//   useEffect(() => {
//     window.history.pushState(null, '', window.location.href);
//     window.onpopstate = () => {
//       window.history.pushState(null, '', window.location.href);
//     };
//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, []);

//   useEffect(() => {
//     // Check if the MCQ questions have already been fetched
//     if (!hasFetched && mcqquestions.length === 0) {
//       setIsLoading(true);
//       axios
//         .get(`${BASE_URL}/getMCQQuestionsforTest/${email}`)
//         .then((response) => {
//           const questionsWithImage = response.data.questions.map((question) => {
//             if (question.image && question.image.data) {
//               const base64Image = question.image.data;
//               question.imageURL = `data:${question.image.contentType};base64,${base64Image}`;
//             }
//             question.question = DOMPurify.sanitize(question.question);
//             return question;
//           });

//           // Randomize the order of the questions
//           const randomizedQuestions = shuffleArray(questionsWithImage);

//           localStorage.setItem('mcqquestions', JSON.stringify(randomizedQuestions));
//           setMCQQuestions(randomizedQuestions);
//           setHasFetched(true);
//           localStorage.setItem('hasFetched', true);    
//         })
//         .catch((error) => {
//           console.log(error);
//         })
//         .finally(() => {
//           setIsLoading(false); // Set loading state to false after fetching is complete
//           console.log(isLoading);
//         });
//     }
//   }, [hasFetched, mcqquestions, email]);

//   function shuffleArray(array) {
//     // Create a new array to avoid mutating the original array
//     const shuffledArray = [...array];
//     let currentIndex = shuffledArray.length;
//     let temporaryValue;
//     let randomIndex;

//     // While there remain elements to shuffle
//     while (currentIndex !== 0) {
//       // Pick a remaining element
//       randomIndex = Math.floor(Math.random() * currentIndex);
//       currentIndex -= 1;

//       // Swap it with the current element
//       temporaryValue = shuffledArray[currentIndex];
//       shuffledArray[currentIndex] = shuffledArray[randomIndex];
//       shuffledArray[randomIndex] = temporaryValue;
//     }

//     return shuffledArray;
//   }

//   function handleBeforeUnload(event) {
//     event.preventDefault();
//     event.returnValue = '';
//   }
//   async function handleNextClick() {
//     setLoading(true)
//     const missingAnswers = mcqquestions.some((question) => !selectedAnswers[question._id]);

//     if (missingAnswers) {
//       alert('Please answer all questions before continuing.');
//       setLoading(false)
//     } else {
//       const selectedAnswers = JSON.parse(localStorage.getItem('selectedAnswers'));
//       const requestBody = {
//         email,
//         selectedAnswers,
//       };

//       axios
//         .post(`${BASE_URL}/testresults`, requestBody)
//         .then((response) => {
//           console.log(response);
//         })
//         .catch((error) => {
//           console.log(error);
//           toast.warn('Failed to update Test Results.')
//           setIsLoading(false)

//         });
//       const requestBody2 = {
//         email,
//         testStatus: 'Test Taken',
//       };

//       axios
//         .patch(`${BASE_URL}/updateCandidateTeststatus`, requestBody2)
//         .then((response) => {
//           console.log(response);
//         })
//         .catch((error) => {
//           setLoading(false)
//           toast.warn('Failed to update Test Status')
//           console.log(error);
//         });

//       ///Post the data to the Applicant Tracking System when applicant completed the test
//       // try {
//       //   await axios.put(`${ATS_URL}/appicant/update/comments`, { email: email, comment: `The applicant has successfully completed the test. To proceed with the evaluation, please click the following link: <a href="${window.location.origin}" target="_blank">Click Here</a>`, commentBy: "TES System", cRound: "Online Assessment Test", nextRound: "Veera", status: "Hiring Manager" })
//       //     .then(res => console.log(res))
//       // } catch (err) {
//       //   console.log(err.message)
//       // }

//       localStorage.clear();
//       setLoading(false)
//       navigate('../Results');
//     }
//   }

//   function handleRadioChange(event, questionId) {
//     const selectedAnswer = event.target.value;
//     setSelectedAnswers({
//       ...selectedAnswers,
//       [questionId]: selectedAnswer,
//     });
//     localStorage.setItem(
//       'selectedAnswers',
//       JSON.stringify({
//         ...selectedAnswers,
//         [questionId]: selectedAnswer,
//       })
//     );
//   }

//   function handleSubmitExam() {
//     handleNextClick();
//   }

//   const timeLimit = 2 * 60; // 40 minutes
//   const [secondsLeft, setSecondsLeft] = useState(timeLimit);
//   // const [isAlertShown, setIsAlertShown] = useState(false); // State to check if the alert is shown

//   useEffect(() => {
//     if (secondsLeft === 0) {
//       // Automatically submit the exam if time is up

//       handleNextClick();
//     }
//   }, [secondsLeft, handleNextClick]);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setSecondsLeft((prevSeconds) => {
//         if (prevSeconds > 0) {
//           if (prevSeconds === 30 ) {
//             // Show toast warning when 5 minutes left
//             toast.warn('You have 5 minutes left! Please submit your exam.');
//             // setIsAlertShown(true); // Update state to prevent showing the alert multiple times
//           }
//           return prevSeconds - 1;
//         }
//         return 0;
//       });
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const minutes = Math.floor(secondsLeft / 60);
//   const seconds = secondsLeft % 60;

//   return (
//     <div style={{ backgroundColor: '#BDCCDA' }}>
//       <h2 style={{ marginTop: '50px', marginLeft: '20px' }}>MCQ Questions</h2>
//       <div style={{backgroundColor: 'white', color: 'black', textAlign:'center', padding:'20px'}}>
//           Time Left: {minutes} minutes {seconds} seconds
//         </div>
//       <div className="mcq-questions-list">
//         {mcqquestions.map((question) => (
//           <div key={question._id} className="card" style={{ width: '100%', marginTop: '10px' }}>
//             <div className="card-header">
//               <h3 dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.question) }} />
//             </div>
//             {question.imageURL && (
//               <div className="card-body">
//                 <img src={question.imageURL} alt="Question Image" style={{ width: 'auto', height: 'auto' }} />
//               </div>
//             )}
//             <div className="card-body">
//               <label>
//                 <input
//                   type="radio"
//                   name={question._id}
//                   value={1}
//                   checked={selectedAnswers[question._id] == 1}
//                   onChange={(e) => handleRadioChange(e, question._id)}
//                 />
//                 {question.choice1}
//               </label>
//               <br />
//               <label>
//                 <input
//                   type="radio"
//                   name={question._id}
//                   value={2}
//                   checked={selectedAnswers[question._id] == 2}
//                   onChange={(e) => handleRadioChange(e, question._id)}
//                 />
//                 {question.choice2}
//               </label>
//               <br />
//               <label>
//                 <input
//                   type="radio"
//                   name={question._id}
//                   value={3}
//                   checked={selectedAnswers[question._id] == 3}
//                   onChange={(e) => handleRadioChange(e, question._id)}
//                 />
//                 {question.choice3}
//               </label>
//               <br />
//               <label>
//                 <input
//                   type="radio"
//                   name={question._id}
//                   value={4}
//                   checked={selectedAnswers[question._id] == 4}
//                   onChange={(e) => handleRadioChange(e, question._id)}
//                 />
//                 {question.choice4}
//               </label>
//             </div>
//           </div>
//         ))}
//       </div>
//       <center>
//         <div>
//              {
//                 loading ? <button style={{ marginTop: '3px', backgroundColor: '#FF7619', borderRadius: '8px', margin: '10px', padding: '5px' }} >
//                 Please wait ...
//               </button> :
//               <button style={{ marginTop: '3px', backgroundColor: '#008080', borderRadius: '8px', margin: '10px', padding: '5px' }} type="submit" onClick={handleSubmitExam}>
//                 Submit Test
//               </button>
//               }
//           {/* <button className="btn" style={{ marginTop: '3px', backgroundColor: '#FFFFFF' }} onClick={handleNextClick}>
//             Submit Your Answers
//           </button> */}
//         </div>
//       </center>
//     </div>
//   );
// };

// export default getMCQQuestionsForTest;





import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../Service/helper';
import DOMPurify from 'dompurify';
import { toast } from 'react-toastify';

const getMCQQuestionsForTest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mcqquestions, setMCQQuestions] = useState(
    JSON.parse(localStorage.getItem('mcqquestions')) || []
  );
  const [selectedAnswers, setSelectedAnswers] = useState(
    JSON.parse(localStorage.getItem('selectedAnswers')) || {}
  );
  const [hasFetched, setHasFetched] = useState(
    localStorage.getItem('hasFetched') || false
  );
  const email = JSON.parse(localStorage.getItem('email'));
  const atsId = JSON.parse(localStorage.getItem('Id'));
  console.log(atsId);

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    // Check if the MCQ questions have already been fetched
    if (!hasFetched && mcqquestions.length === 0) {
      setIsLoading(true);
      axios
        .get(`${BASE_URL}/getMCQQuestionsforTest/${email}`)
        .then((response) => {
          const questionsWithImage = response.data.questions.map((question) => {
            if (question.image && question.image.data) {
              const base64Image = question.image.data;
              question.imageURL = `data:${question.image.contentType};base64,${base64Image}`;
            }
            question.question = DOMPurify.sanitize(question.question);
            return question;
          });

          // Randomize the order of the questions
          const randomizedQuestions = shuffleArray(questionsWithImage);

          localStorage.setItem('mcqquestions', JSON.stringify(randomizedQuestions));
          setMCQQuestions(randomizedQuestions);
          setHasFetched(true);
          localStorage.setItem('hasFetched', true);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false); // Set loading state to false after fetching is complete
          console.log(isLoading);
        });
    }
  }, [hasFetched, mcqquestions, email]);

  function shuffleArray(array) {
    // Create a new array to avoid mutating the original array
    const shuffledArray = [...array];
    let currentIndex = shuffledArray.length;
    let temporaryValue;
    let randomIndex;

    // While there remain elements to shuffle
    while (currentIndex !== 0) {
      // Pick a remaining element
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // Swap it with the current element
      temporaryValue = shuffledArray[currentIndex];
      shuffledArray[currentIndex] = shuffledArray[randomIndex];
      shuffledArray[randomIndex] = temporaryValue;
    }

    return shuffledArray;
  }

  function handleBeforeUnload(event) {
    event.preventDefault();
    event.returnValue = '';
  }
  
  async function handleNextClick() {
    setLoading(true);

    const selectedAnswers = JSON.parse(localStorage.getItem('selectedAnswers'));
    console.log(selectedAnswers);
    console.log(mcqquestions);
      
    mcqquestions.forEach(question => {
      if (!(question._id in selectedAnswers)) {
        selectedAnswers[question._id] = '';
        console.log(question._id);
      }
    });
    
    console.log(selectedAnswers);
    const requestBody = {
      email,
      selectedAnswers,
      // mcqquestions, // send the entire list of questions (both answered and unanswered)
    };

    axios
      .post(`${BASE_URL}/testresults`, requestBody)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        toast.warn('Failed to update Test Results.');
        setIsLoading(false);
      });
    const requestBody2 = {
      email,
      testStatus: 'Test Taken',
    };

    axios
      .patch(`${BASE_URL}/updateCandidateTeststatus`, requestBody2)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        setLoading(false);
        toast.warn('Failed to update Test Status');
        console.log(error);
      });

    localStorage.clear();
    setLoading(false);
    navigate('../Results');
  }

  function handleRadioChange(event, questionId) {
    const selectedAnswer = event.target.value;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: selectedAnswer,
    });
    localStorage.setItem(
      'selectedAnswers',
      JSON.stringify({
        ...selectedAnswers,
        [questionId]: selectedAnswer,
      })
    );
  }

  function handleSubmitExam() {
    handleNextClick();
  }

  const timeLimit = 2 * 60; // 40 minutes
  const [secondsLeft, setSecondsLeft] = useState(timeLimit);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prevSeconds) => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        }
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const missingAnswers = mcqquestions.some((question) => !selectedAnswers[question._id]);
    if (secondsLeft === 30 && missingAnswers >=1) {
      // handleNextClick();
      alert("30 sec left, Answer all the questions.")
    }else if (secondsLeft === 30) {
      alert("30 sec left")
    }
    else if (secondsLeft === 0) {
      handleNextClick();
    }
  }, [secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div style={{ backgroundColor: '#BDCCDA' }}>
      <h2 style={{ marginTop: '90px', marginLeft: '20px' }}>MCQ Questions</h2>
      <div style={{ backgroundColor: 'white', color: 'black', textAlign: 'center', padding: '10px' }}>
        Time Left: {minutes} minutes {seconds} seconds
      </div>
      <div className="mcq-questions-list">
        {mcqquestions.map((question) => (
          <div key={question._id} className="card" style={{ width: '100%', marginTop: '10px' }}>
            <div className="card-header">
              <h3 dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.question) }} />
            </div>
            {question.imageURL && (
              <div className="card-body">
                <img src={question.imageURL} alt="Question Image" style={{ width: 'auto', height: 'auto' }} />
              </div>
            )}
            <div className="card-body">
              <label>
                <input
                  type="radio"
                  name={question._id}
                  value={1}
                  checked={selectedAnswers[question._id] == 1}
                  onChange={(e) => handleRadioChange(e, question._id)}
                />
                {question.choice1}
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  name={question._id}
                  value={2}
                  checked={selectedAnswers[question._id] == 2}
                  onChange={(e) => handleRadioChange(e, question._id)}
                />
                {question.choice2}
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  name={question._id}
                  value={3}
                  checked={selectedAnswers[question._id] == 3}
                  onChange={(e) => handleRadioChange(e, question._id)}
                />
                {question.choice3}
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  name={question._id}
                  value={4}
                  checked={selectedAnswers[question._id] == 4}
                  onChange={(e) => handleRadioChange(e, question._id)}
                />
                {question.choice4}
              </label>
            </div>
          </div>
        ))}
      </div>
      <center>
        <div>
          {loading ? (
            <button
              style={{ marginTop: '3px', backgroundColor: '#FF7619', borderRadius: '8px', margin: '10px', padding: '5px' }}
            >
              Please wait ...
            </button>
          ) : (
            <button
              style={{ marginTop: '3px', backgroundColor: '#008080', borderRadius: '8px', margin: '10px', padding: '5px' }}
              type="submit"
              onClick={handleSubmitExam}
              // disabled={secondsLeft !== 0}
            >
              Submit Test
            </button>
          )}
        </div>
      </center>
    </div>
  );
};

export default getMCQQuestionsForTest;

















