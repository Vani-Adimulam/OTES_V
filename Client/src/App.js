import React, { useState, createContext } from "react";
import { Route, Routes } from "react-router-dom";
import CandidateForm from "./CandidateForm";
import EvaluatorForm from "./EvaluatorForm";
import Nav from "./Nav";
import Myprofile from "./Myprofile";
import CandidateLogin from "./CandidateLogin";
import CandidateList from "./CandidateList";
import Instructions from "./Test/Instructions";
import MCQQuestions from "./Test/getMCQQuestionsForTest";
import Summary from "./Summary";

import AllMCQQuestions from "./getAllMCQQuestions";
import AllParagraphQuestions from "./getAllParagraphQuestions";
import ParagraphQuestions from "./Test/getParagraphQuestions";
import EvalQuestions from "./EvalQuestions";
import Results from "./Test/Results";
import Home from "./Home";
import LogIn from "./LogIn";
import AddQuestions from "./AddQuestions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PendingApprovals from "./PendingApprovals";
import ForgotPassword from "./ForgotPassword";
import VerifyOTP from "./VerifyOTP";
import ResetPassword from "./ResetPassword";
export const store = createContext();

function App() {
  const [token, setToken] = useState(null);
  return (
    <div>
      
      <store.Provider value={[token, setToken]}>
        <Nav />
        <ToastContainer/>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/Login" element={<LogIn/>} />
            <Route path="/login" element={<EvaluatorForm />} />
            <Route path ="/forgot-password" element ={<ForgotPassword/>} />
            <Route path="/verify-otp" element={<VerifyOTP/>}/>
            <Route path="/reset-password" element ={<ResetPassword/>}/>
            <Route path="/myprofiledashboard" element={<Myprofile />} />
            <Route path="/pendingApprovals" element={<PendingApprovals />} />
            <Route path="/CandidateForm" element={<CandidateForm />} />
            <Route path="/verify-emails" element={<CandidateLogin />} />
            <Route path="/CandidateList" element={<CandidateList />} />
            <Route path="/AddQuestions" element={<AddQuestions/>} />
            <Route path="/instructions" element={<Instructions />} />
            <Route path="/getMCQQuestionsForTest" element={<MCQQuestions/>}/>
            <Route path="/summary" element={<Summary/>}/>
            
            <Route
              path="/getParagraphQuestionsForTest"
              element={<ParagraphQuestions />}
            />
            <Route path="/Results" element={<Results />} />
            <Route path="/getAllMCQQuestions" element={<AllMCQQuestions />} />
            <Route
              path="/getAllParagraphQuestions"
              element={<AllParagraphQuestions />}
            />
            <Route path="/EvalQuestions" element={<EvalQuestions />} />
          </Routes>
        
      </store.Provider>
    </div>
  );
}
export default App;
