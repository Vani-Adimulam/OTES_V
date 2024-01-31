import React, { useState } from 'react'
import OTPInput from "otp-input-react";
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const VerifyOTP = () => {
    const navigate = useNavigate()
    const [OTP, setOTP] = useState("");
    const [loading, setLoading] = useState(false)
    const handleSubmitOtp = (e) => {
        e.preventDefault()
        if (OTP !== null && OTP.length === 6) {
            setLoading(true)

            //Compare OTP :
            const sendOTP = localStorage.getItem('otp') || null
            if (OTP === sendOTP) {
                toast.success("OTP has been Verified Successfully.")
                navigate('/reset-password')
            } else {
                toast.warning("Please enter a valid OTP.")
                setLoading(false)
            }

        }
    }
    return (
        <div style={{ marginTop: "100px", display: "flex", justifyContent: "center", padding: "10px" }}>
            <div style={{ border: "1px solid #333", padding: "20px", width: "50%", background: "#fff", borderRadius: "10px" }}>
            <h4 style={{ padding: "20px 20px 10px 20px",textAlign:"center" }}>OTP Verification  </h4>
            <hr/>
                <form onSubmit={handleSubmitOtp}>
                    <div className='mb-2'>
                        <label className='mb-2' htmlFor='otp' > <b>Enter OTP : </b></label>
                        <OTPInput  value={OTP} secure={false} onChange={setOTP} autoFocus OTPLength={6} otpType="number" disabled={false} />

                    </div>
                    <div>
                        {
                            loading ? <button className='btn btn-primary' disabled={true}>Verifing OTP...</button> : <button className='btn btn-primary'>Verify OTP</button>
                        }
                    </div>
                </form>

            </div>
        </div>
    )
}

export default VerifyOTP