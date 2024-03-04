import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import Pagination from "react-js-pagination";
import DOMPurify from "dompurify";
// import { BsTrash } from "react-icons/bs"; // Import trash icon from react-icons
import "./getAllMCQQuestions.css";
import { BASE_URL } from "./Service/helper";
import { store } from "./App";

const AllMCQQuestions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(6);
  const [showModal, setShowModal] = useState(false);
  const eval_email = location.state?.email;

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

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
    axios
      .get(`${BASE_URL}/getMCQQuestions`
      ,{
        headers: {
          "x-token": token, // Include the token in the request headers
        },
      }        
      )
      .then((response) => {
        // Convert the image data to a base64 URL
        const questionsWithImage = response.data.map((question) => {
          if (question.image && question.image.data) {
            const base64Image = question.image.data;
            question.imageURL = `data:${question.image.contentType};base64,${base64Image}`;
          }
          return question;
        });

        setQuestions(questionsWithImage);
        setFilteredQuestions(questionsWithImage);
        // setAreas([...new Set(questionsWithImage.map((question) => question.area))]);
        setAreas(['VLSI_FRESHER_1', 'VLSI_FRESHER_2', 'VLSI_FRESHER_3', 'VLSI_EXPERIENCE'])
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  

  function handleProfileClick() {
    navigate("/myprofiledashboard", { state : { email : eval_email }});
  }

  function handleAreaChange(event) {
    const selectedArea = event.target.value;
    setSelectedArea(selectedArea);
    setFilteredQuestions(
      selectedArea
        ? questions.filter((question) => question.area === selectedArea)
        : questions
    );
    setCurrentPage(1); // Reset to first page
  }

  const deleteQuestion = (questionId) => {
    axios
      .delete(`${BASE_URL}/deleteQuestion/${questionId}`
      ,{
        headers: {
          "x-token": token, // Include the token in the request headers
        },
      } 
      )
      .then((response) => {
        console.log(response);
        // Handle successful deletion, such as updating the list of questions
        const updatedQuestions = questions.filter(
          (question) => question._id !== questionId
        );
        setQuestions(updatedQuestions);
        setFilteredQuestions(updatedQuestions);
        setShowModal(true); // Show the success modal
        setTimeout(() => {
          setShowModal(false); // Close the modal after a delay
        }, 1500); // Adjust the delay as needed
      })
      .catch((error) => {
        // Handle error
        console.log(error);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    window.location.reload(); // Refresh the page after deletion
  };

  return (
    <Container style={{ marginTop: "90px" }}>
      <h2 style={{ marginBottom: "30px" }}>Multiple choice Questions</h2>
      <Form.Group as={Row}>
        <Col sm={4}>
          <Form.Control
            as="select"
            value={selectedArea}
            onChange={handleAreaChange}
          >
            <option value="">Select an area</option>
            {areas.map((area, index) => (
              <option key={index} value={area=="VLSI_EXPERIENCE" ? 'VLSI' : area}>
                {area}
              </option>
            ))}
          </Form.Control>
        </Col>
      </Form.Group>
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          style={{
            backgroundColor: "#6BD8BA",
            marginRight: "10px",
            border: "none",
          }}
          onClick={handleProfileClick}
        >
          Back To Dashboard
        </Button>
      </div>

      <Row>
        {currentQuestions.map((question) => (
          <Col key={question._id} lg={6} style={{ marginBottom: "30px" }}>
            <div className="card h-100 mt-3">
              <div
                className="card-body"
                style={{ backgroundColor: "#BDCCDA", borderRadius: "5px" }}
              >
                {/* Render question as HTML content using dangerouslySetInnerHTML */}
                <h5
                  className="card-title"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(question.question),
                  }}
                ></h5>
                {question.imageURL && (
                  <img
                    style={{
                      width: "300px",
                      height: "100px",
                      marginBottom: "5px",
                    }}
                    src={question.imageURL}
                    alt="Question"
                    className="question-image"
                  />
                )}
                <Form>
                  <Form.Check
                    type="radio"
                    id={`${question._id}-1`}
                    label={
                      <span className="choice-label">{question.choice1}</span>
                    }
                    name={question._id}
                    value="1"
                    defaultChecked={question.correct_choice === "1"}
                    disabled
                    className="custom-radio"
                  />

                  <Form.Check
                    type="radio"
                    id={`${question._id}-2`}
                    label={question.choice2}
                    name={question._id}
                    value="2"
                    defaultChecked={question.correct_choice === "2"}
                    disabled
                    className="custom-radio"
                  />
                  <Form.Check
                    type="radio"
                    id={`${question._id}-3`}
                    label={question.choice3}
                    name={question._id}
                    value="3"
                    defaultChecked={question.correct_choice === "3"}
                    disabled
                    className="custom-radio"
                  />
                  <Form.Check
                    type="radio"
                    id={`${question._id}-4`}
                    label={question.choice4}
                    name={question._id}
                    value="4"
                    defaultChecked={question.correct_choice === "4"}
                    disabled
                    className="custom-radio"
                  />
                </Form>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <small className="text-muted">Area: {question.area}</small>
                <button
                  className="delete-question-button" 
                  onClick={() => deleteQuestion(question._id)}
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </Col>
        ))}
      </Row>
      <Pagination
        activePage={currentPage}
        itemsCountPerPage={questionsPerPage}
        totalItemsCount={filteredQuestions.length}
        pageRangeDisplayed={5}
        onChange={setCurrentPage}
        itemClass="page-item"
        linkClass="page-link"
        style={{ marginTop: "30px" }}
      />

      {/* Modal for deletion success */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Question Deleted Successfully!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          The question has been deleted from the database.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AllMCQQuestions;
