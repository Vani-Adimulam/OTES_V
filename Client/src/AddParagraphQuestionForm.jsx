import { useState } from "react";
import { Card, Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { BASE_URL } from "./Service/helper";



const AddParagraphQuestionForm = () => {
  const [question, setQuestion] = useState("");
  const [area, setArea] = useState("");
  const [subtype, setSubtype] = useState("");
  const [answer, setAnswer] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question || !area || !subtype || !answer) {
      alert("Please enter all the fields.");
      return;
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/addParagraphQuestion`,
        {
          question,
          area,
          subtype,
          answer,
        }
      );
      console.log(response.data);
      setQuestion("");
      setArea("");
      setSubtype("");
      setAnswer("");
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card style={{ width: "70rem",marginTop:"10px" }}>
        <Card.Header style={{ fontFamily: "sans-serif"}}><h3>Add Question</h3></Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="area">
              <Form.Label style={{ fontFamily: "sans-serif" }}><h3>Area</h3></Form.Label>
              <Form.Select
                value={area}
                onChange={(e) => setArea(e.target.value)}
              >
                <option value="">Select an area</option>
                <option value="VLSI">VLSI</option>
                <option value="EMBEDDED">EMBEDDED</option>
                <option value="SOFTWARE">SOFTWARE</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="question">
              <Form.Label>
                <h4>Question</h4>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                maxLength="150"
              />
            </Form.Group>
            <Form.Group controlId="subtype">
              <Form.Label><h5>Subtype</h5></Form.Label>
              <Form.Control
                as="select"
                value={subtype}
                onChange={(e) => setSubtype(e.target.value)}
              >
                <option value="">Select subtype</option>
                <option value="text">Text</option>
                <option value="code">Code</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="answer">
              <Form.Label><h5>Answer</h5></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </Form.Group>

            <button type="submit" className="button" style={{ marginTop: "10px" }}>
              <span className="button__text">Add</span>
              <span className="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round"
                strokeLinecap="round" stroke="currentColor" height="24"
                fill="none" className="svg">
                <line y2="19" y1="5" x2="12" x1="12"></line>
                <line y2="12" y1="12" x2="19" x1="5"></line>
              </svg>
              </span>
            </button>
          </Form>
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Question added successfully!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Your question has been added to the database. Thank you for your
              contribution!
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    </div>

  );
};

export default AddParagraphQuestionForm;



