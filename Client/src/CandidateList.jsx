import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Table, Button, Modal, Form, FormControl, FormGroup, FormLabel, FormSelect } from "react-bootstrap";
import axios from "axios";
import pen from "./assets/pen.svg";
import assessment from "./assets/assessment.png";
import { faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify'
import { ATS_URL, BASE_URL } from "./Service/helper";
import ExcelExport from "./ExcelExport";
import { store } from "./App"

const CandidateList = () => {
  const location = useLocation();
  const [candidates, setCandidates] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCandidate, setEditCandidate] = useState({});
  const [searchText, setSearchText] = useState("");
  const [testStatus, setTestStatus] = useState("");
  const [sortField, setSortField] = useState("");
  const [result, setResult] = useState("On Hold")
  const [sortDirection, setSortDirection] = useState("");
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

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios(`${BASE_URL}/all`);
        const candidates = result.data;
        setTestStatus(candidates.testStatus);

        const emailList = candidates.map(candidate => candidate.email).join(",");
        const res = await axios.get(`${BASE_URL}/getTestResults?emails=${emailList}`);
        const testResultsMap = new Map(res.data.map(result => [result.email, result]));

        const updatedCandidates = candidates.map(candidate => {
          const testResult = testResultsMap.get(candidate.email);
          if (testResult && testResult.totalScore !== undefined) {
            const selectedAnswers = testResult.selectedAnswers;
            const totalQuestions = Object.keys(selectedAnswers).length;
            return {
              ...candidate,
              totalScore: testResult.totalScore,
              total: totalQuestions,
            };
          } else {
            return candidate;
          }
        });

        setCandidates(updatedCandidates);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleEditModalClose = () => setShowEditModal(false);

  const handleEditModalShow = (candidate) => {
    const readOnlyFields =
      candidate.testStatus === "Test Taken" ||
      candidate.testStatus === "Evaluated";
    setEditCandidate({
      ...candidate,
      readOnlyFields: readOnlyFields,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (editCandidate.result === "On Hold") {
      try {
        await axios.post(`${BASE_URL}/updateTestResult/${editCandidate.email}`, { result: result })
        await axios.put(`${ATS_URL}/appicant/update/comments`, { email: editCandidate.email, comment: `The applicant's test result has been updated from On Hold to <b> ${result} </b>`, commentBy: "TES System", cRound: "Online Assessment Test", nextRound: "Veera", status: "Hiring Manager" })
        window.location.reload()
      } catch (err) {
        console.log(err.message)
        alert('Failed to update the result. Please update the result again')
      }
    }
    try {
      await axios.put(`${BASE_URL}/edit/${editCandidate._id}`, {
        name: editCandidate.name,
        email: editCandidate.email,
        testStatus: editCandidate.testStatus,
        area: editCandidate.area,
        mcqCount: editCandidate.mcqCount,
        codeCount: editCandidate.codeCount,
        paragraphCount: editCandidate.paragraphCount,
      });
      const index = candidates.findIndex(
        (candidate) => candidate._id === editCandidate._id
      );
      const updatedCandidates = [...candidates];
      updatedCandidates[index].name = editCandidate.name;
      updatedCandidates[index].email = editCandidate.email;
      updatedCandidates[index].testStatus = testStatus;
      updatedCandidates[index].area = editCandidate.area;
      updatedCandidates[index].mcqCount = editCandidate.mcqCount;
      updatedCandidates[index].codeCount = editCandidate.codeCount;
      updatedCandidates[index].paragraphCount = editCandidate.paragraphCount;
      setCandidates(updatedCandidates);
      setShowEditModal(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleSort = (field) => {
    let direction = "asc";
    if (sortField === field && sortDirection === "asc") {
      direction = "desc";
    }
    setSortField(field);
    setSortDirection(direction);

    const sortedCandidates = [...candidates].sort((a, b) => {
      const aValue = a[field].toLowerCase();
      const bValue = b[field].toLowerCase();
      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      } else if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      } else {
        return 0;
      }
    });
    setCandidates(sortedCandidates);
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortDirection === "asc" ? (
        <FontAwesomeIcon icon={faSortUp} />
      ) : (
        <FontAwesomeIcon icon={faSortDown} />
      );
    } else {
      return <FontAwesomeIcon icon={faSort} />;
    }
  };

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleEvaluateModalShow = (candidate) => {
    if (candidate.testStatus === "Test Not Taken" || candidate.testStatus === "Test Cancelled") {
      toast.warn("Test is not taken or test has been cancelled. Evaluation cannot be performed.")
      return;
    }
    const state = { email: candidate.email, testStatus: candidate.testStatus, result: candidate.result, eval_email: eval_email };
    navigate("/EvalQuestions", { state });
  };
  function handleProfileClick() {
    console.log(eval_email)
    navigate("/myprofiledashboard", { state : { email : eval_email }});
  }


  return (
    <>
      <center>
        <h1 style={{ marginTop: "100px" }}>Candidates</h1>
        <div style={{ display: "flex", justifyContent: "space-evenly", marginBottom: "5px" }}>
          <button
            className="btn"
            style={{ backgroundColor: "#E4E6EB", fontFamily: "fantasy" }}
            onClick={handleProfileClick}
          >
            Back To Dashboard
          </button>
          </div>
        <div>
          <ExcelExport data={candidates} />
        </div>
        <FormControl
          type="text"
          placeholder="Search by email"
          value={searchText}
          onChange={handleSearch}
          style={{ width: "40rem" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "70rem",
            marginTop: "5px",
          }}
        >
          <Table striped bordered hover>
            <thead style={{ fontSize: "15px" }}>
              <tr>
                <th>S.No</th>
                <th onClick={() => handleSort("name")}>
                  Name {getSortIcon("name")}
                </th>
                <th onClick={() => handleSort("email")}>
                  Email {getSortIcon("email")}
                </th>
                <th onClick={() => handleSort("testStatus")}>Test Status {getSortIcon("testStatus")}</th>
                <th>Edit Candidate Data</th>
                <th>Evaluate</th>
                <th>Result</th>
                <th>Total Marks</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "15px" }}>
              {filteredCandidates.map((candidate,index) => (
                <tr key={candidate._id}>
                  <td>{index+1}</td>
                  <td>{candidate.name}</td>
                  <td>{candidate.email}</td>
                  <td>{candidate.testStatus}</td>
                  <td>
                    <Button 
                      style={{
                        backgroundColor: "#58FEDB",
                        borderColor: "#dee2e6",
                      }}
                      onClick={() => handleEditModalShow(candidate)}
                    >
                      <img src={pen} alt="edit" />
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="light"
                      onClick={() => handleEvaluateModalShow(candidate)}
                    >
                      <img
                        src={assessment}
                        alt="assessment"
                        style={{ width: "20px", height: "20px" }}
                      />
                    </Button>
                  </td>
                  <td>{candidate.result}</td>
                  <td>
                    {candidate.totalScore} / {candidate.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </center>
      
      <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Candidate</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter Name"
                value={editCandidate.name}
                onChange={(event) =>
                  setEditCandidate({
                    ...editCandidate,
                    name: event.target.value,
                  })
                }
                readOnly={editCandidate.readOnlyFields}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={editCandidate.email}
                onChange={(event) =>
                  setEditCandidate({
                    ...editCandidate,
                    email: event.target.value,
                  })
                }
                readOnly={editCandidate.readOnlyFields}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Test Status</Form.Label>
              <Form.Control
                as="select"
                value={editCandidate.testStatus}
                onChange={(event) => {
                  setEditCandidate({
                    ...editCandidate,
                    testStatus: event.target.value,
                  });
                }}
                disabled={
                  editCandidate.testStatus === "Test Taken" ||
                  editCandidate.testStatus === "Evaluated"
                }
              >
                <option value="">Select status</option>
                <option value="Test Cancelled">Cancel Test</option>
                <option value="Test Not Taken">Test Not Taken</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Area</Form.Label>
              <FormControl
                style={{ backgroundColor: "#7F8081" }}
                type="text"
                placeholder="Enter Area"
                defaultValue={editCandidate.area}
                readOnly
              />
            </Form.Group>
            {editCandidate.result === "On Hold" &&
              <FormGroup>
                <FormLabel>Result</FormLabel>
                <FormSelect as="select" onChange={(e) => setResult(e.target.value)}>
                  <option value="On Hold">On Hold</option>
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </FormSelect>
              </FormGroup>
            }
            {/* <Form.Group>
              <Form.Label>MCQ Count</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Count"
                value={editCandidate.mcqCount}
                onChange={(event) =>
                  setEditCandidate({
                    ...editCandidate,
                    mcqCount: event.target.value,
                  })
                }
                readOnly={editCandidate.readOnlyFields}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Code Count</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Count"
                value={editCandidate.codeCount}
                onChange={(event) =>
                  setEditCandidate({
                    ...editCandidate,
                    codeCount: event.target.value,
                  })
                }
                readOnly={editCandidate.readOnlyFields}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Paragraph Count</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter email"
                value={editCandidate.paragraphCount}
                onChange={(event) =>
                  setEditCandidate({
                    ...editCandidate,
                    paragraphCount: event.target.value,
                  })
                }
                readOnly={editCandidate.readOnlyFields}
              />
            </Form.Group> */}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleEditModalClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default CandidateList;
