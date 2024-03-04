import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { store } from "./App";
import { BASE_URL } from "./Service/helper";
import '@fortawesome/fontawesome-free/css/all.min.css';


const CandidateForm = () => {
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false)
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

  const resetForm = () => {
    setName("");
    setEmail("");
    setArea("");
  };

  const changeNameHandler = (e) => {
    setName(e.target.value);
  };

  const changeEmailHandler = (e) => {
    setEmail(e.target.value);
  };

  const changeAreaHandler = (e) => {
    setArea(e.target.value);
  };

  const handleProfileClick = () => {
    navigate("/myprofiledashboard", { state: { email: eval_email } });
  };

  const submitHandler = async(e) => {
    e.preventDefault();
    setIsLoading(true)
    // Trim the input values to remove leading and trailing spaces
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedArea = area.trim();

    // Check if any of the trimmed input values are empty strings
    if (trimmedName === "" || trimmedEmail === "" || trimmedArea === "") {
      setErrorMessage("Invalid input. Please fill in all fields.");
      setIsLoading(false)
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage("Invalid email address!");
      setIsLoading(false)
      return;
    }

    await axios
      .post(`${BASE_URL}/register`, {
        name: trimmedName,
        email: trimmedEmail,
        area: trimmedArea,
      }, {
        headers: {
          "x-token": token, // Include the token in the request headers
        },
      })
      .then((res) => {
        console.log(res.data);
        toast.success(`${trimmedName} added successfully`)
        setIsLoading(false)
        resetForm();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false)
        setErrorMessage("Error occurred while registering");
      });
  };

  return (
    <center>
      <div className="container" style={{ marginTop: "90px" }}>
        <div
          className="card mt-5"
          style={{
            backgroundColor: "#f8f9fa",
            border: "none",
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
            width: "600px",
            height: "560px",
          }}
        >
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Add Candidate</h2>
            <button
              className="btn"
              style={{ backgroundColor: "#6BD8BA", fontFamily: "fantasy" }}
              onClick={handleProfileClick}
            >
              Back To Dashboard
            </button>
            <form onSubmit={submitHandler}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={changeNameHandler}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={changeEmailHandler}
                />
              </div>
              <div className="form-group">
                <label htmlFor="area">Area</label>
                <select
                  className="form-control"
                  as="select"
                  id="area"
                  value={area}
                  onChange={changeAreaHandler}
                >
                  <option value="">---Select area for online test---</option>
                  <option value="VLSI_FRESHER_1">VLSI_FRESHER_1</option>
                  <option value="VLSI_FRESHER_2">VLSI_FRESHER_2</option>
                  <option value="VLSI_FRESHER_3">VLSI_FRESHER_3</option>
                  {/* <option value="VLSI_FRESHER_4">VLSI_FRESHER_4</option> */}
                  <option value="VLSI">VLSI_EXPERIENCE</option>

                </select>
              </div>

              <div className="form-group text-center">
                                {
                                    isLoading ? <button type="submit" disabled className="btn btn-warning mt-2" >
                                        Please Wait...
                                    </button> : <button type="submit" className="btn btn-dark mt-2">
                                        Add Candidate
                                    </button>
                                }
                            </div>
              {/* <div className="form-group">
                <button type="submit" className="btn btn-dark mt-2">
                  Add Candidate
                </button>
              </div> */}
              {errorMessage && (
                <div className="alert alert-danger mt-3" role="alert">
                  {errorMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </center>
  );
};

export default CandidateForm;


{/* <div className="form-group">
                <label htmlFor="mcqCount">MCQ Count</label>
                <input
                  type="number"
                  className="form-control"
                  id="mcqCount"
                  placeholder="Enter MCQ count"
                  min={5}
                  max={10}
                  value={mcqCount}
                  onChange={changeMcqCountHandler}
                />
              </div>
              <div className="form-group">
                <label htmlFor="codeCount">Code Questions Count</label>
                <input
                  type="number"
                  className="form-control"
                  id="codeCount"
                  placeholder="Enter Code Questions count"
                  min={5}
                  max={10}
                  value={codeCount}
                  onChange={changeCodeCountHandler}
                />
              </div>
              <div className="form-group">
                <label htmlFor="paragraphCount">
                  Paragraph Questions Count
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="paragraphCount"
                  placeholder="Enter Paragraph Questions count"
                  min={5}
                  max={10}
                  value={paragraphCount}
                  onChange={changeParagraphCountHandler}
                />
              </div> */}
