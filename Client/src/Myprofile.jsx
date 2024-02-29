import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { store } from "./App";
import axios from "axios";
import { BASE_URL } from "./Service/helper";



const MyProfile = () => {
  const location = useLocation();
  const email = location.state?.email || "TES APP"; // Add a conditional check for email property
  // console.log(email)
  const [token, setToken] = useContext(store);
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isTokenRetrieved, setIsTokenRetrieved] = useState(false); // New state variable
  const [PendingCount,setPendingCount]=useState(0)
  const navigate = useNavigate();


  const getTokenFromStorage = () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !token) {
      setToken(storedToken);
    }
    setIsTokenRetrieved(true); // Mark the token as retrieved
  };

  const handleCandidateListClick = () => {
    navigate("/CandidateList", { state: { email: email } });
  };

  const handleAddCandidateClick = () => {
    navigate("/CandidateForm", { state: { email: email } });
  };

  const handleViewQuestionsClick = () => {
    navigate("/getAllMCQQuestions", { state: { email: email } });
  };

  const handleAddQuestionsClick = () => {
    navigate("/AddQuestions", { state: { email: email } });
  };
  const handlePendingApprovals =()=>{
    navigate("/pendingApprovals",{ state: { email: email } })
  }
  const count=async()=>{
    await axios.get(`${BASE_URL}/pending/approvals/count`).then(res=>setPendingCount(res.data.pendingRequests)).catch(err=>console.log(err))
  }
  
  useEffect(() => {
    count()
    getTokenFromStorage();
    return () => {
      // Cleanup function to reset state when component is unmounted
      setData({});
      setIsLoading(true);
    };
    
  }, []);

  useEffect(() => {
    if (!isTokenRetrieved) {
      return; // Skip the API request until the token is retrieved
    }

    if (!token) {
      navigate("/login"); // Redirect to the login page if token is not available
    } else {
      localStorage.setItem("token", token);
      setIsLoading(true);
      // console.log(email)
      axios
        .get(`${BASE_URL}/myprofile/${email}`, {
          headers: {
            "x-token": token,
          },
        })
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false));
    }
  }, [token, navigate, isTokenRetrieved]);

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn")
    navigate("/login"); // Redirect to the login page after logout
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
 
  return (
    <div style={{ backgroundColor: "#F0F1F4" }}>
      {data && (
        <center>
          <br />
          <div className="card" style={{ width: "18rem", marginTop: "90px" }}>
          <br />
            <h5 className="card-title">Welcome {email}</h5>



            <div className="card-body">
              <button
                className="btn"
                style={{
                  marginLeft: "5px",
                  backgroundColor: "#6BD8BA",
                  fontFamily: "fantasy",
                  marginTop: "2px",
                }}
                onClick={handleCandidateListClick}
              >
                Manage Candidate
              </button>
            </div>
            <div className="card-body">
              <button
                to="/CandidateForm"
                className="btn"
                style={{
                  marginLeft: "5px",
                  backgroundColor: "#01717B",
                  fontFamily: "fantasy",
                }}
                onClick={handleAddCandidateClick}
              >
                Add Candidate
              </button>
            </div>
            <div className="card-body">
              <button
                to="/getAllMCQQuestions"
                className="btn"
                style={{
                  marginLeft: "5px",
                  backgroundColor: "#1E5BB6",
                  fontFamily: "fantasy",
                }}
                onClick={handleViewQuestionsClick}
              >
                View Questions
              </button>
            </div>
            <div className="card-body">
              <button
                to="/AddQuestions"
                className="btn"
                style={{
                  marginLeft: "5px",
                  backgroundColor: "#B1D7E7",
                  fontFamily: "fantasy",
                }}
                  onClick={handleAddQuestionsClick}
                >
                  Add Questions
                </button>
            </div>
            <div className="card-body">
              <button
                style={{ fontFamily: "fantasy" }}
                className="btn btn-warning"
                onClick={handlePendingApprovals}
              >
                Pending Approvals({PendingCount})
              </button>
            </div>
            <div className="card-body">
              <button
                style={{ fontFamily: "fantasy" }}
                className="btn btn-danger"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </center>
      )}
    </div>
  );
};

export default MyProfile;
