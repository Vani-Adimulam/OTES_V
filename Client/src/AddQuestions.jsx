import React, { useContext, useState, useEffect } from "react";
import McqForm from "./McqForm";
import AddParagraphQuestionForm from "./AddParagraphQuestionForm";
import { Form, Container, Row, Col} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { store } from "./App"

const AddQuestions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useContext(store) || localStorage.getItem("token")
  const eval_email = location.state?.email;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!token && !storedToken) {
      navigate("/login");
    } else if (!token && storedToken) {
      setToken(storedToken);
    }
  }, [token, navigate, setToken]);
  
  function handleProfileClick() {
    navigate("/myprofiledashboard", { state : { email : eval_email }});
  }
  
  const [selectedQuestionType, setSelectedQuestionType] = useState("");
  
  const handleQuestionTypeChange = (e) => {
    setSelectedQuestionType(e.target.value);
  };

  return (
    <Container className="mt-5" >
      <Row className="justify-content-between" >
        <Col lg="9">
          <Form style={{ marginTop: "70px" }}>
            <Form.Group controlId="questionTypeSelect">
              <Form.Label style={{ fontFamily: "revert-layer", fontWeight: "bold" }}>
                Please Select Your Question Type
              </Form.Label>
              <Form.Control
                as="select"
                className="form-select"
                value={selectedQuestionType}
                onChange={handleQuestionTypeChange}
              >
                <option value="">Select a question type</option>
                <option value="MCQ">MCQ</option>
                <option value="">Other types coming soon</option>
                {/* <option value="TEXT">Paragraph</option> */}
              </Form.Control>
            </Form.Group>
          </Form>
          {selectedQuestionType === "TEXT" && <AddParagraphQuestionForm />}
          {selectedQuestionType === "MCQ" && <McqForm />}
        </Col>
        <Col lg="3" className="text-right mt-5">
          <button
            className="btn"
            onClick={handleProfileClick}
            style={{ backgroundColor: "#6BD8BA", fontFamily: "fantasy" }}
          >
            Back To Dashboard
          </button>
        </Col>  
      </Row>
    </Container>
  );
};

export default AddQuestions;
