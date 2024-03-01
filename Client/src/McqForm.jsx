import { useState, useRef } from "react";
import { Card, Form, Button, Modal } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import "./McqForm.css";
import { BASE_URL } from "./Service/helper";

const AddQuestionForm = () => {
  const [question, setQuestion] = useState("");
  const [choice1, setChoice1] = useState("");
  const [choice2, setChoice2] = useState("");
  const [choice3, setChoice3] = useState("");
  const [choice4, setChoice4] = useState("");
  const [correct_choice, setCorrectChoice] = useState("");
  const [area, setArea] = useState("");
  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const quillRef = useRef();

  const handleQuestionChange = (value) => {
    setQuestion(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !area ||
      !question ||
      !choice1 ||
      !choice2 ||
      !choice3 ||
      !choice4 ||
      !correct_choice
    ) {
      alert("Please enter all the fields");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("area", area);
      formData.append("question", question);
      formData.append("choice1", choice1);
      formData.append("choice2", choice2);
      formData.append("choice3", choice3);
      formData.append("choice4", choice4);
      formData.append("correct_choice", correct_choice);
      formData.append("image", image);

      const response = await axios.post(
        `${BASE_URL}/addQuestionMCQ`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      setArea("");
      setQuestion("");
      setChoice1("");
      setChoice2("");
      setChoice3("");
      setChoice4("");
      setCorrectChoice("");
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const toolbarOptions = [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote", "code-block"],
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card style={{ width: "60rem", marginTop: "10px" }}>
        <Card.Header style={{ fontFamily: "sans-serif" }}>
          <h3>Add Question</h3>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="area">
              <Form.Label style={{ fontFamily: "sans-serif" }}>
                <h3>Area</h3>
              </Form.Label>
              <Form.Select
                value={area}
                onChange={(e) => setArea(e.target.value)}
              >
                <option value="">Select an area</option>
                <option value="VLSI_FRESHER_1">VLSI_FRESHER_1</option>
                <option value="VLSI_FRESHER_2">VLSI_FRESHER_2</option>
                <option value="VLSI_FRESHER_3">VLSI_FRESHER_3</option>
                <option value="VLSI_FRESHER_4">VLSI_FRESHER_4</option>
                <option value="VLSI">VLSI_EXPERIENCE</option>
                {/* <option value="VLSI">VLSI</option>
                <option value="EMBEDDED">EMBEDDED</option> 
                <option value="SOFTWARE">SOFTWARE</option>
                <option value="VLSI_FRESHER">VLSI_FRESHER</option> */}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="question">
              <Form.Label>
                <h4>Question</h4>
              </Form.Label>
              <ReactQuill
                ref={quillRef}
                value={question}
                onChange={handleQuestionChange}
                modules={{ toolbar: toolbarOptions }}
              />
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>
                <h5>Image</h5>
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Form.Group>

            <Form.Group controlId="choice1">
              <Form.Label>
                <h5>Choice 1</h5>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter choice 1"
                value={choice1}
                onChange={(e) => setChoice1(e.target.value)}
                maxLength="150"
              />
            </Form.Group>
            <Form.Group controlId="choice2">
              <Form.Label>
                <h5>Choice 2</h5>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter choice 2"
                value={choice2}
                onChange={(e) => setChoice2(e.target.value)}
                maxLength="150"
              />
            </Form.Group>
            <Form.Group controlId="choice3">
              <Form.Label>
                <h5>Choice 3</h5>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter choice 3"
                value={choice3}
                onChange={(e) => setChoice3(e.target.value)}
                maxLength="150"
              />
            </Form.Group>
            <Form.Group controlId="choice4">
              <Form.Label>
                <h5>Choice 4</h5>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter choice 4"
                value={choice4}
                onChange={(e) => setChoice4(e.target.value)}
                maxLength="150"
              />
            </Form.Group>
            <Form.Group controlId="correct_choice">
              <Form.Label>
                <h5>Correct Choice</h5>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the number of the correct choice (1-4)"
                value={correct_choice}
                onChange={(e) => setCorrectChoice(e.target.value)}
                maxLength="1"
              />
            </Form.Group>

            <button
              type="submit"
              className="button"
              style={{ marginTop: "10px" }}
            >
              <span className="button__text">Add</span>
              <span className="button__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  stroke="currentColor"
                  height="24"
                  fill="none"
                  className="svg"
                >
                  <line y2="19" y1="5" x2="12" x1="12" />
                  <line y2="12" y1="12" x2="19" x1="5" />
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

export default AddQuestionForm;
