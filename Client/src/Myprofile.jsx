import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { store } from "./App";
import axios from "axios";
import { BASE_URL } from "./Service/helper";
import "./Myprofile.css";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { person } from '@fortawesome/free-solid-svg-icons';
// index.js or App.js
// index.js or App.js
// import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
// import '@fortawesome/fontawesome-free/css/solid.min.css';
// import '@fortawesome/fontawesome-free/css/brands.min.css';



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
    <div style={{ backgroundColor: "#ffffff", margin: '0px', padding: '0px' }}>
      {data && (
        <center>
          <div>
            <h5 className=""style={{ width: "18rem", marginTop: "75px", paddingTop: "10px"}}>Welcome {email}</h5>
          </div>
          <br />
          {/* <div className="card" style={{ width: "18rem", marginTop: "90px" }}> */}
            {/* <h5 className="card-title">Welcome {email}</h5> */}
          <div className="card-body" style={{ margin: "0px", padding: "0px", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
            <div className="" style={{ width: "18rem", marginTop: "10px", marginRight: "10px", marginBottom: "30px"}}>
              <div className="card1" >
                <p><i class="fa-solid fa-user" style={{ fontSize: '30px', color: 'black', textAlign: 'start', paddingBottom: '10px' }}></i></p>
                <button
                  className="button1"
                  // style={{
                  //   marginLeft: "5px",
                  //   backgroundColor: "#6BD8BA",
                  //   fontFamily: "fantasy",
                  //   marginTop: "2px",
                  // }}
                  onClick={handleCandidateListClick}
                >
                  Manage Candidate
                </button>
              </div>
            </div>
            
            <div className="" style={{ width: "18rem", marginTop: "10px", marginRight: "10px", marginBottom: "30px" }}>
              <div className="card2">
                <p><i class="fa-solid fa-user-plus" style={{ fontSize: '30px', color: 'black', textAlign: 'start', paddingBottom: '10px' }}></i></p>
                <button
                  to="/CandidateForm"
                  className="button1"
                  // style={{
                  //   marginLeft: "5px",
                  //   backgroundColor: "#01717B",
                  //   fontFamily: "fantasy",
                  // }}
                  onClick={handleAddCandidateClick}
                >
                  Add Candidate
                </button>
              </div>
            </div>

            <div className="" style={{ width: "18rem", marginTop: "10px", marginBottom: "30px" }}>
              <div className="card3">
              <p><i class="fa-solid fa-eye" style={{ fontSize: '30px', color: 'black', textAlign: 'start', paddingBottom: '10px' }}></i></p>
                <button
                  to="/getAllMCQQuestions"
                  className="button1"
                  // style={{
                  //   marginLeft: "5px",
                  //   backgroundColor: "#1E5BB6",
                  //   fontFamily: "fantasy",
                  // }}
                  onClick={handleViewQuestionsClick}
                >
                  View Questions
                </button>
              </div>
            </div>
          </div>
          <div className="" style={{ marginBottom: "0px", padding: "0px", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
            <div className="" style={{ width: "18rem", marginTop: "10px", marginRight: "10px", marginBottom: "30px" }}>
              <div className="card4">
              <p><i class="fas fa-plus-circle" style={{ fontSize: '30px', color: 'black', textAlign: 'start', paddingBottom: '10px' }}></i></p>
                <button
                  to="/AddQuestions"
                  className="button1"
                  // style={{
                  //   marginLeft: "5px",
                  //   backgroundColor: "#B1D7E7",
                  //   fontFamily: "fantasy",
                  // }}
                  onClick={handleAddQuestionsClick}
                >
                  Add Questions
                </button>
              </div>
            </div>

            <div className="" style={{ width: "18rem", marginTop: "10px", marginRight: "10px", marginBottom: "30px" }}>
              <div className="card5">
              <p><i class="fas fa-hourglass-half" style={{ fontSize: '30px', color: 'black', textAlign: 'start', paddingBottom: '10px' }}></i></p>
                <button
                  // style={{ fontFamily: "Sans-serif" }}
                  className="button1"
                  onClick={handlePendingApprovals}
                >
                  Pending Approvals({PendingCount})
                </button>
              </div>
            </div>

            <div className="" style={{ width: "18rem", marginTop: "10px", marginBottom: "30px"}}>
              <div className="card6">
              <p><i class="fas fa-arrow-left" style={{ fontSize: '30px', color: 'black', textAlign: 'start', paddingBottom: '10px' }}></i></p>
                <button
                  // style={{ fontFamily: "Sans-serif" }}
                  className="button1"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </center>
      )}
    </div>
  );
};

export default MyProfile;
