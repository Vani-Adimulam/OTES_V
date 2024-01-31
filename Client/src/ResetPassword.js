import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { BASE_URL } from './Service/helper'

const ResetPassword = () => {
    const [pwd, setPwd] = useState("")
    const [confirmPwd, setConfirmPwd] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    ///If no email it should backto forgot password : 
    useEffect(() => {
        const condition = localStorage.getItem('userEmail') || false
        if (condition === false) {
            navigate("/forgot-password")
        }
    }, [])

    const handleGetOtp = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (pwd === confirmPwd) {
            const email = localStorage.getItem('userEmail') || false
            if (email) {
                try{
                    await axios.post(`${BASE_URL}/updatePassword/user/${email} `, { newPassword: pwd })
                    toast.success("Password has been reset successfully.")
                    localStorage.removeItem('userEmail')
                    navigate("/login")
                }
                catch(err){
                    toast.warning("Failed to update password.Please try after some time!")
                    setLoading(false)
                }     
            }

        } else {
            toast.warning("The new password and the confirm password do not match.")
            setLoading(false)
        }
        setLoading(false)
    }
    return (
        <div style={{ marginTop: "100px", display: "flex", justifyContent: "center", padding: "10px" }}>
            <div style={{ border: "1px solid #333", width: "50%", background: "#fff", borderRadius: "10px" }}>
                <h4 style={{ padding: "20px 20px 10px 20px" }}>Reset Password : </h4>
                <hr />
                <form onSubmit={handleGetOtp} style={{ padding: "10px 30px 30px 30px", }}>
                    <div>
                        <label htmlFor='pwd'><b>New Password :</b> </label>
                        <input placeholder='Enter new password...' onChange={(e) => setPwd(e.target.value)} style={{ width: "100%", padding: "5px", marginTop: "10px" }} type="text" required></input>
                    </div>
                    <div className='mt-2'>
                        <label htmlFor='cpwd'><b>Confirm Password :</b> </label>
                        <input placeholder='Enter password again...' onChange={(e) => setConfirmPwd(e.target.value)} style={{ width: "100%", padding: "5px", marginTop: "10px" }} type="text" required></input>
                    </div>
                    <div>
                        {
                            loading ? <button className='btn btn-primary mt-4' disabled={true}>Changing Password...</button> : <button className='btn btn-primary mt-4'>Change Password</button>
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword