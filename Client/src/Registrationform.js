import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { store } from "./App";
import { BASE_URL } from "./Service/helper";
const Registrationform = () => {
    // const location = useLocation();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [area, setArea] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [token, setToken] = useContext(store) || localStorage.getItem("token")
    // const eval_email = location.state?.email;
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
        setErrorMessage("")
    };
    const submitHandler = (e) => {
        e.preventDefault();
        setIsLoading(true)
        // Trim the input values to remove leading and trailing spaces
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedArea = area.trim();
        // Check if any of the trimmed input values are empty strings
        if (trimmedName === "" ) {
            setErrorMessage("Please enter name.");
            setIsLoading(false)
            return;
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(trimmedEmail)) {
            setErrorMessage("Invalid email address!");
            setIsLoading(false)
            return;
        }
        if(email===""){
            setErrorMessage("Please select area for online test")
            setIsLoading(false)
            return;
        }
        if(area===""){
            setErrorMessage("Please select area for online test")
            setIsLoading(false)
            return;
        }
        axios
            .post(`${BASE_URL}/register`, {
                name: trimmedName,
                email: trimmedEmail,
                area: trimmedArea,
                isApproved:false
            }, {
                headers: {
                    "x-token": token, // Include the token in the request headers
                },
            })
            .then((res) => {
                toast.success(res.data);
                resetForm();
                setIsLoading(false)

            })
            .catch((error) => {
                console.log(error);
                setErrorMessage("Error occurred while registering");
                setIsLoading(false)
            });
    };

    return (
        <div >
            <div className="container" >
                <div
                    className="card mt-5"
                    style={{
                        backgroundColor: "#f8f9fa",
                        margin: "0px auto",
                        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                        width: "600px",
                    }}
                >
                    <div className="card-body ">
                        <h2 className="card-title text-center mb-4">Register Candidate</h2>
                        <hr />
                        <form onSubmit={submitHandler}>
                            <div className="form-group" >
                                <label className="p-2" htmlFor="name"><b>Name</b></label>
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
                                <label className="p-2" htmlFor="email"><b>Email</b></label>
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
                                <label className="p-2" htmlFor="area"><b>Area</b></label>
                                <select
                                    className="form-select"
                                    id="area"
                                    value={area}
                                    onChange={changeAreaHandler}
                                >
                                    <option value="">---select area for online test---</option>
                                    <option value="VLSI_FRESHER_1">VLSI_FRESHER_1</option>
                                    <option value="VLSI_FRESHER_2">VLSI_FRESHER_2</option>
                                    <option value="VLSI_FRESHER_3">VLSI_FRESHER_3</option>
                                    <option value="VLSI_FRESHER_4">VLSI_FRESHER_4</option>
                                     <option value="VLSI">VLSI_EXPERIENCE</option>

                                    {/* <option value="SOFTWARE">Software</option> */}
                                    {/* <option value="EMBEDDED">Embedded</option> */}
                                    {/* <option value="VLSI">VLSI</option> */}
                                    {/* <option value="VLSI_FRESHER">VLSI_FRESHER</option> */}

                                </select>
                            </div>
                            {errorMessage && (
                                <div className="alert alert-danger mt-3" role="alert">
                                    {errorMessage}
                                </div>
                            )}
                            <div className="form-group text-center">
                                {
                                    isLoading ? <button type="submit" disabled className="btn btn-warning mt-2" >
                                        Please Wait...
                                    </button> : <button type="submit" className="btn btn-dark mt-2">
                                        Register
                                    </button>
                                }
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registrationform;




// import React from 'react'

// const Registrationform = () => {
//     return (
//         <div style={{border:"2px solid red",width:"50%",height:"50vh",borderRadius:"10px",background:"white"}}>
//             <h2 className='p-2'>Registration Form</h2>
//             <hr/>
//             <div className='p-2 border border-2'>
//             <div>
//             <form>
//                 <div>
//                     <label>Name</label>
//                     <input type="" className='form-control'/>
//                 </div>
//             </form>
//             </div>

//             </div>
//         </div>
//     )
// }

// export default Registrationform