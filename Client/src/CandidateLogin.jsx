import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import axios from "axios";
import "./CandidateLogin.css";
import { BASE_URL } from "./Service/helper";



const CandidateLogin = () => {
  const [data, setData] = useState({
    email: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const submitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem("email", JSON.stringify(data["email"]));
    axios
      .post(`${BASE_URL}/verify-emails`, data)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Login Successfully")
          navigate("/instructions");
        } else {
          console.log("Email is not valid");
          setErrorMessage("Email not registered");
        }
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Email not registered or Test Already Taken");
        toast.error("Email not registered")
        toast.warn("Test already taken")
        toast("your test may have cancelled",{
        className:"toast-message"})
      });
  };

  //navigation to the instructions page
 

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="">
          <div className="card shadow">
            <div  className="card-body">
              <h2 className="card-title text-center">Candidate Login</h2>
              <form style={{border:"2px solid green",maxWidth:"100%"}} onSubmit={submitHandler} className="form">
                <span className="title">Welcome to our online assessment portal</span>
                <p className="description">
                  We're excited that you've chosen to take this test and we
                  hope you find it to be a valuable experience. This test is 
                  designed to assess your skills and knowledge and is an important step in your professional development.
                </p>
                <input
                  placeholder="Enter your email"
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={data.email}
                  onChange={changeHandler}
                  required
                />
                <div className="text-center">
                  <button className="cta">
                    <span className="hover-underline-animation">Login</span>
                    <svg
                      viewBox="0 0 46 16"
                      height="10"
                      width="30"
                      xmlns="http://www.w3.org/2000/svg"
                      id="arrow-horizontal"
                    >
                      <path
                        transform="translate(30)"
                        d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z"
                        data-name="Path 10"
                        id="Path_10"
                      ></path>
                    </svg>
                  </button>
                </div>
                {errorMessage && (
                  <div className="mt-3 text-center text-danger">
                    {errorMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateLogin;
