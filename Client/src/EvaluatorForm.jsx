import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify'
import { store } from "./App.js";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";
import { BASE_URL } from "./Service/helper.js";


const EvaluatorForm = () => {
  const [token, setToken] = useContext(store);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .post(`${BASE_URL}/loginEvaluator`, data)
      .then((res) => {
        if (res.data.token) {
          setToken(res.data.token);
          toast.success(`Data Verified, Welcome ${data.email}`)
        } else {
          setErrorMessage("Email or password is not valid");
          toast.error('Invalid Credentials')
        }
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Email or password is invalid.");
      });
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      navigate("/myprofiledashboard", { state: { email: data.email } });
    }
  }, [token, navigate, data.email]);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="">
          <div className="card shadow">
            <div style={{width:"100%"}} className="card-body">
              <h2 className="card-title text-center">Evaluator Login</h2><hr/>
              <form onSubmit={submitHandler} autoComplete="off">
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    onChange={changeHandler}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    onChange={changeHandler}
                    required
                  />
                </div>
                {errorMessage && (
                  <div className="mt-3 text-center text-danger">
                    {errorMessage}
                  </div>
                )}
                
                <div className="text-center">
                  <button className="cta">
                   <button className="btn btn-light"> <span className="hover-underline-animation">Login</span></button>
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
                        id="Path_10"></path>
                    </svg>
                  </button>
                  
                </div>
                <hr/>
                <div style={{textAlign:"center",padding:"10px"}}>
                  <Link to="/forgot-password" >Forgotten password?</Link>
                  <br/>
                </div>
              </form>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluatorForm;
