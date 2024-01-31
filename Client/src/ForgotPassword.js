import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { BASE_URL } from './Service/helper'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [loading,setLoading] =useState(false)
    const navigate = useNavigate()
    const handleGetOtp = async (e) => {
        e.preventDefault()
        console.log(email)
        setLoading(true)
        const responce = await axios.post(`${BASE_URL}/user/otp/send/${email}`)
        if (responce.status === 200) {
            console.log(responce)
            localStorage.setItem('otp', responce.data.gen_otp)
            localStorage.setItem('userEmail',email)
            navigate("/verify-otp")
        } else {
            toast.warning("Failed to send otp.Please try again after some time.")
            setLoading(false)
        }

    }
    return (
        <div style={{ marginTop: "100px", display: "flex", justifyContent: "center", padding: "10px" }}>
            <div style={{ border: "1px solid #333", width: "50%", background: "#fff", borderRadius: "10px" }}>
                <h4 style={{ padding: "20px 20px 10px 20px" }}>Forgot Password ? </h4>
                <p style={{ padding: "0px 25px" }}>No need to worry! You can initiate a password reset here.</p>
                <hr />
                <form onSubmit={handleGetOtp} style={{ padding: "10px 30px 30px 30px", }}>
                    <div>
                        <label htmlFor='email'><b>Email :</b> </label>
                        <input placeholder='Enter your email...' onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "5px", marginTop: "10px" }} type="email" required></input>
                    </div>
                    <div>
                       {
                        loading ? <button disabled={true} className='btn btn-primary mt-4'>Sending OTP...</button> : <button className='btn btn-primary mt-4'>Send OTP</button>
                       } 
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword