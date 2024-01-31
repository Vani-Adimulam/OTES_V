// server.js
const express = require("express");
const mongoose = require("mongoose");
const middleware = require("./middleware");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const app = express();
const cors = require("cors");
const Candidate = require("./models/Candidate");
const Evaluator = require("./models/Evaluator");
const MCQQuestion = require("./models/MCQQuestions");
const ParagraphQuestion = require("./models/ParagraphQuestions");
const TestResults = require("./models/TestResults");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const PORT = process.env.PORT || 7001;
const path = require("path");
require("dotenv").config();
const logger = require("./Loggers/logger");
const EvalLogger = require("./Loggers/evallogger.js");
const addCandidateLogger = require("./Loggers/addcandidate.js");
const addMCQLogger = require("./Loggers/addMCQLogger");
const AddPara = require("./Loggers/addPara");
const ViewMcq = require("./Loggers/ViewMCQLogger");
const Viewpara = require("./Loggers/ViewPara");
const editlog = require("./Loggers/editlog");
const viewcandidate = require("./Loggers/ViewCandidate");
const testresult = require("./Loggers/testresult");
const TestStatus = require("./Loggers/testStatus");
const getTest = require("./Loggers/getTest");
const evaluated = require("./Loggers/Evaluationlog");
const nodemailer =require("nodemailer")

const getMongoDBUrl = () => {
  const databaseName = process.env.NODE_ENV === 'prod' ? 'prod' : 'dev';
  return process.env[`MONGODB_URI_${process.env.NODE_ENV.toUpperCase()}`];
};

mongoose
  .connect(getMongoDBUrl(), { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Connect to MongoDB
// mongoose
//   .connect(
//     process.env. MONGODB_PROD_URI,
//     {
//       useUnifiedTopology: true,
//       useNewUrlParser: true,
//       // useCreateIndex: true
//     }
//   )
//   .then(() => console.log("DB Connection established"))
//   .catch((err) => console.log(`DB Connection error: ${err.message}`));



app.use(express.json());

app.use(cors({ origin: "*" }));

app.use(bodyParser.json());

// API to add evaluator
app.post("/addEvaluator", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);
    // Save the hashed password and email to the database
    await Evaluator.create({ email, password: hashedPassword });

    return res.send("Evaluator added successfully");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});
     
//candidate register route
app.post("/register", async (req, res) => {
  try {
    const { email } = req.body;
    const { name } = req.body;
    const { area } = req.body;
    const { mcqCount } = req.body;
    const { codeCount } = req.body;
    const { paragraphCount } = req.body;
    const { atsId } = req.body;
    const { isApproved } = req.body;

    console.log(isApproved)
    let exist = await Candidate.findOne({ email });
    if (exist) {
      return res.send("Candidate Already Exist");
    }
    let newUser = new Candidate({
      email,
      isApproved,
      name,
      area,
      mcqCount,
      codeCount,
      paragraphCount,
      atsId
    });
    await newUser.save();
    res.status(200).send("Registered Successfully");
    // res.status(200).json({details:newUser})
    addCandidateLogger.addCandidateLogger.log(
      "info",
      `request sent to MongoDB database checked with existing data, it is a new data so,added a candidate ${email}`
    );
  } catch (err) {
    console.log(err);
    addCandidateLogger.addCandidateLogger.log(
      "error",
      "error in adding candidate"
    );
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/verify-emails", async (req, res) => {
  try {
    const { email } = req.body;
    const candidate = await Candidate.findOne({ email });
    logger.Logger.log(
      "info",
      `request sent to MongoDB database matched with the data ${email} login successfull`
    );
    if (!candidate) {
      logger.Logger.log("error", "Error in candidate login");
      return res.status(404).json({ status: "The email address you entered is not registered." });
    }

    if (candidate.testStatus !== "Test Not Taken") {
      return res.status(401).json({ status: "Test already taken." });
    }

    if (candidate.testStatus === "Test Cancelled") {
      return res.status(401).json({ status: "Test cancelled" });
    }
    if(candidate.isApproved === false){
      res.status(403).json({ status: "Your registration has been successful. You will need to wait for evaluator approval before you can start your test." });
    }else{
      res.status(200).json({ status: "Success" });
    }
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/loginEvaluator", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find the evaluator in the database by email
    const evaluator = await Evaluator.findOne({ email });
    EvalLogger.EvalLogger.log(
      "info",
      `evaluator Request sent to database email and password are matched with the data ,${email} login successfull`
    );
    // If evaluator with provided email does not exist, return an error message
    if (!evaluator) {
      EvalLogger.EvalLogger.log("error", "Evaluator login error");
      return res.status(400).send("Invalid email");
    }
    // Compare the hashed password with the password provided by the user
    const isMatch = await bcrypt.compare(password, evaluator.password);
    // If the password is incorrect, return an error message
    if (!isMatch) {
      return res.status(400).send("Invalid Password");
    }
    // Create a JWT token with the evaluator email and id as payload
    const payload = { user: { id: evaluator.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// API endpoint for adding a question to the "questions" collection
//Remove middle ware for token issue.
app.post("/addQuestionMCQ", upload.single("image"), async (req, res) => {
  try {
    const {
      area,
      question,
      choice1,
      choice2,
      choice3,
      choice4,
      correct_choice,
    } = req.body;

    // Create a new question document
    const newQuestion = new MCQQuestion({
      area,
      question,
      choice1,
      choice2,
      choice3,
      choice4,
      correct_choice,
    });

    // Check if an image file was uploaded
    if (req.file) {
      newQuestion.image.data = req.file.buffer;
      newQuestion.image.contentType = req.file.mimetype;
    }

    // Save the new question document to the "questions" collection
    const savedQuestion = await newQuestion.save();
    addMCQLogger.addMCQLogger.log(
      "info",
      `addQuestionMCQ is triggered to post,${newQuestion.area} question added in MCQuestions database`
    );
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error("Error saving question to MongoDB:", error);
    addMCQLogger.addMCQLogger.log("error", "Error in adding MCQ");
    res.status(500).json({ error: "Internal server error" });
  }
});

//add a post API for Paragraph question with subtype field and other fields as question, answer.
app.post("/addParagraphQuestion", async (req, res) => {
  const { question, area, subtype, answer } = req.body;
  const newQuestion = new ParagraphQuestion({
    question,
    area,
    subtype,
    answer,
  });
  try {
    const savedQuestion = await newQuestion.save();
    AddPara.addPara.log(
      "info",
      `${newQuestion.area} Para question added and saved in the database`
    );
    res.status(201).json(savedQuestion);
  } catch (err) {
    console.error("Error saving question to MongoDB:", err);
    AddPara.addPara.log(
      "error",
      "error occured while adding paragraph question"
    );
    res.status(500).json({ error: "Internal server error" });
  }
});

// a get api to fetch and send all questions and fields?

app.get("/getMCQQuestions", async (req, res) => {
  try {
    const { ids } = req.query;
    const idArr = ids ? ids.split(",") : null;
    if (idArr) {
      const questions = await MCQQuestion.find({ _id: { $in: idArr } });
      res.json(questions.map(question => ({
        _id: question._id,
        area: question.area,
        question: question.question,
        choice1: question.choice1,
        choice2: question.choice2,
        choice3: question.choice3,
        choice4: question.choice4,
        correct_choice: question.correct_choice,
        image: question.image.data ? {
          data: question.image.data.toString("base64"),
          contentType: question.image.contentType
        } : null
      })));
    } else {
      const questions = await MCQQuestion.find({});
      ViewMcq.ViewMCQLogger.log(
        "info",
        "View questions module triggered, MCQuestions are fetched from the database and displayed to the user successfully"
      );
      res.json(questions.map(question => ({
        _id: question._id,
        area: question.area,
        question: question.question,
        choice1: question.choice1,
        choice2: question.choice2,
        choice3: question.choice3,
        choice4: question.choice4,
        correct_choice: question.correct_choice,
        image: question.image.data ? {
          data: question.image.data.toString("base64"),
          contentType: question.image.contentType
        } : null
      })));
    }
  } catch (error) {
    console.error("Error getting questions from MongoDB:", error);
    ViewMcq.ViewMCQLogger.log("error", "Error in displaying MCQuestions");
    res.status(500).json({ error: "Internal server error" });
  }
});



// API to get Paragraph questions
app.get("/getParagraphQuestions", async (req, res) => {
  try {
    const { ids } = req.query;
    const idArr = ids ? ids.split(",") : null;
    if (idArr) {
      const questions = await ParagraphQuestion.find({ _id: { $in: idArr } });
      res.json(questions);
    } else {
      const questions = await ParagraphQuestion.find({});
      Viewpara.ViewPara.log(
        "info",
        "view paragraph questions button triggered,data fetched from the database and displayed to the user"
      );
      res.json(questions);
    }
  } catch (error) {
    console.error("Error getting questions from MongoDB:", error);
    Viewpara.ViewPara.log("error", "cannot display para questions");
    res.status(500).json({ error: "Internal server error" });
  }
});

// create an API to get random MCQ Questions from Question Bank given area
// and number
app.get("/getMCQQuestionsforTest/:email", async (req, res) => {
  try {
    const email = req.params.email.replace(/['"]+/g, ""); // remove quotes from the string
    const candidate = await Candidate.find({ email: email });
    if (!candidate) {
      res.status(500).json("Candidate not found");
    } else {
      const area = candidate[0].area;
      // console.log(area)
      // const number = candidate[0].mcqCount;
      const questions = await MCQQuestion.aggregate([
        { $match: { area: area } },
        { $sort: { _id: 1 } },
        { $project: { correct_choice: 0 } }, // exclude correct_choice
      ]);
      // console.log(questions)
      res.json({ questions });
      getTest.GetTest.log(
        "info",
        `getMCQQuestionsforTest/:email is triggered to fetch the questions from the MongoDB database and created test for ${candidate[0].email}`
      );
    }
  } catch (error) {
    console.log(error);
    getTest.GetTest.log(
      "error",
      `Unable to create Test for the ${candidate[0].email}`
    );
    console.log(
      "Unable to create Test, Please select the correct number of questions"
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// create an API to get random PARAGRAPH Questions from Question Bank given area
// subtype and number
app.get("/getParagraphQuestionsforTest/:email/", async (req, res) => {
  const email = req.params.email.replace(/['"]+/g, ""); // remove quotes from the string
  const candidate = await Candidate.find({ email: email });
  console.log(candidate);

  if (!candidate) {
    res.status(500).json("Candidate not found");
  } else {
    try {
      const area = candidate[0].area;
      const number1 = candidate[0].codeCount;
      const number2 = candidate[0].paragraphCount;
      const code_questions = await ParagraphQuestion.aggregate([
        { $match: { area: area, subtype: "code" } },
        { $sample: { size: Number(number1) } },
        { $sort: { _id: 1 } },
        { $project: { answer: 0 } }, // exclude answer
      ]);
      const text_questions = await ParagraphQuestion.aggregate([
        { $match: { area: area, subtype: "text" } },
        { $sample: { size: Number(number2) } },
        { $sort: { _id: 1 } },
        { $project: { answer: 0 } }, // exclude answer
      ]);
      questions = code_questions.concat(text_questions);
      // console.log(questions)
      res.json({ questions });
    } catch (error) {
      console.log(error);
      console.log(
        "Unable to create Test, Please select correct number of questions"
      );
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.get("/myprofile/:email", async (req, res) => {
  try {
    const email = req.params.email;
    // console.log(email);

    if (!email) {
      return res.status(400).send("Email not provided");
    }

    let exist = await Evaluator.findOne({
      email: email,
    });

    if (!exist) {
      return res.status(400).send("User not found");
    }

    res.json(exist);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

app.post("/testresults", async (req, res) => {
  try {
    // Create a new instance of the TestResults model
    const testresults = new TestResults(req.body);
    // Save the new instance to the database
    await testresults.save();
    testresult.TestResult.log(
      "info",
      "Candidate took and submit the test to save the email & selected answeres into the MongoDB database by triggering testresults API"
    );
    // Return the new instance as a JSON response
    res.json(testresults);
  } catch (err) {
    console.log(err); // log the error message
    testresult.TestResult.log(
      "error",
      "issue in saving testresults in to the database"
    );
    return res.status(500).send("Server Error");
  }
});

//update the candidate
//10-05-23 API modified to fetch total candidate data
app.put("/edit/:id", async (req, res) => {
  try {
    const {
      email,
      testStatus,
      name,
      mcqCount,
      codeCount,
      paragraphCount,
    } = req.body;
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { email, testStatus, name, mcqCount, codeCount, paragraphCount },
      { new: true }
    );
    if (!candidate) {
      editlog.EditLog.log("error", "cannot edit the candidate");
      return res.status(404).send("Candidate not found");
    }
    res.status(200).send("Candidate updated successfully");
    editlog.EditLog.log(
      "info",
      ` edit candidate api is triggered by the evaluator && ${candidate.name} got edited and updated data is saved to the database`
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
});

app.get("/all", async (req, res) => {
  try {
    const candidates = await Candidate.find({isApproved:true});
    viewcandidate.ViewCandidate.log(
      "info",
      "(all)API is triggered on selecting Manage candidate module and all the candidate data is fetched from the MongoDB Database and displayed to the user"
    );
    res.status(200).send(candidates);
  } catch (err) {
    console.log(err);
    viewcandidate.ViewCandidate.log(
      "error",
      "Error in the fetching the data from the databse"
    );
    return res.status(500).send("Internal Server Error");
  }
});

app.patch("/updateCandidateTeststatus", async (req, res) => {
  try {
    const { email, testStatus } = req.body;
    const candidate = await Candidate.findOne({ email });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    candidate.testStatus = testStatus;
    await candidate.save();
    TestStatus.TestStatus.log(
      "info",
      `${email} took the test and submitted,"updateCandidateTeststatus" API is triggered and updated the status in database`
    );
    res.status(200).json({ message: "Test status updated successfully" });
  } catch (err) {
    console.log(err);
    TestStatus.TestStatus.log(
      "error",
      `Cannot update the teststatus of ${email}`
    );
    return res.status(500).send("Server Error");
  }
});

app.get("/getTestResults", async (req, res) => {
  try {
    const emails = req.query.emails.split(",");
    const testResults = await TestResults.find({ email: { $in: emails } });
    res.status(200).json(testResults);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

// Create a put request to alter and update the candidate and add a field called result and give the value "Pass"
app.post("/updateTestResult/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const candidate = await Candidate.findOne({ email });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const result = req.body.result;
    // const totalScore = req.body.totalScore;
    // const codeScore = req.body.codeScore;
    // const textScore = req.body.textScore;
    const totalScore = req.body.mcqScore;
    const testStatus = "Evaluated";
    const testResult = await TestResults.findOneAndUpdate(
      { email },
      { result, totalScore },
      { new: true }
    );
    const candidateresult = await Candidate.findOneAndUpdate(
      { email },
      { result, testStatus: testStatus },
      { new: true }
    );
    if (testResult && candidateresult) {
      res.status(200).json(testResult);
      evaluated.Evaluation.log(
        "info",
        "Evaluation is done - triggered updateTestResult/:email API - posted the result in MongoDB database"
      );
    } else {
      res.status(400).json("Result storing failed");
    }
  } catch (err) {
    console.log(err);
    evaluated.Evaluation.log(
      "error",
      "error in evaluating and storing the result failed"
    );
    return res.status(500).send("Server Error");
  }
});

// Write an API to get the Test Result of a Candidate by hitting the Test Result table
app.get("/getTestResult/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const candidate = await Candidate.findOne({ email });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    const testresults = await TestResults.find({ email: candidate.email });
    console.log(testresults);
    res.status(200).json(testresults);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

app.get("/getAllQuestions/:area", async (req, res) => {
  try {
    const area = req.params.area;
    const mcqquestions = await MCQQuestion.find({ area: area })
      .lean()
      .exec();
    const paragraphquestions = await ParagraphQuestion.find({ area: area })
      .lean()
      .exec();
    const allquestions = [
      ...mcqquestions.map((q) => ({ ...q, type: "MCQ" })),
      ...paragraphquestions.map((q) => ({ ...q, type: "Paragraph" })),
    ];
    console.log(allquestions);
    res.status(200).json(allquestions);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

app.get("/getCandidateDetails/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const candidate = await Candidate.find({ email: email });
    if (!candidate) {
      res.status(500).send("Candidate not found");
    } else {
      res.status(200).json(candidate);
    }
  } catch (error) {
    console.log(error);
  }
});


// DELETE endpoint to delete a question
app.delete("/deleteQuestion/:questionId", (req, res) => {
  const questionId = req.params.questionId;

  // Find the question by ID and delete it
  MCQQuestion.findByIdAndDelete(questionId)
    .then((deletedQuestion) => {
      if (!deletedQuestion) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.json({ message: "Question deleted successfully" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "An error occurred while deleting the question" });
    });
});

//Aproval of the registration of the candicate:   
app.get("/pending/approvals", async (req, res) => {
  try {
    const pending = await Candidate.find({ isApproved: false });
    res.status(200).send(pending)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})
// updating approval of the candicate
app.patch("/confirm/approval/:id/:decide", async (req, res) => {
  const { id, decide } = req.params
  if (decide === "true") {
    const data = await Candidate.findByIdAndUpdate(id, { isApproved: decide }, { new: true })
    res.send(data)
  } else if(decide === "false") {
    const data = await Candidate.findByIdAndDelete(id)
    res.send(data)
  } else{
    res.send("please select any one action")
  }

})
//Sending the no of pending approvals 
app.get("/pending/approvals/count",async(req,res)=>{
  const noOfPendingApprovals= await Candidate.countDocuments({
    isApproved:false
  })
  res.status(200).json({pendingRequests:noOfPendingApprovals})
})


const pendingCandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },  
  area: {
    type: String,
    required: true,
  }
});

const PendingCandidate = mongoose.model('PendingCandidate', pendingCandidateSchema);

module.exports = PendingCandidate;

// Endpoint to submit candidate information
app.post('/candidate/register', async (req, res) => {
  const { name, email, branch } = req.body;

  // Store candidate information temporarily (e.g., in memory or a pending collection)
  const newPendingCandidate = new PendingCandidate({ name, email, branch });
  await newPendingCandidate.save();

  return res.status(200).json({ message: 'Candidate information submitted for evaluation' });
});
// Candidate approval endpoint
app.post('/candidate/approve', async (req, res) => {
  const { id, isApproved } = req.body;

  try {
    // Retrieve the candidate by ID
    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    if (isApproved) {
      // Insert candidate into the database if approved
      await candidate.save();
      return res.status(200).json({ message: 'Candidate approved and added to database' });
    } else {
      // Delete candidate from the database if rejected
      await candidate.remove();
      return res.status(200).json({ message: 'Candidate rejected and not added to database' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Endpoint for evaluator to review pending candidates and make decisions
app.get('/evaluator/dashboard', async (req, res) => {
  const pendingCandidates = await PendingCandidate.find();
  res.status(200).json({ pendingCandidates });
});
// Endpoint for evaluator to review pending candidates and make decisions on sava on database

app.post('/evaluator/decide', async (req, res) => {
  const { candidateId, isApproved } = req.body;

  const pendingCandidate = await PendingCandidate.findById(candidateId);
  if (!pendingCandidate) {
    return res.status(404).json({ error: 'Candidate not found' });
  }

  if (isApproved) {
    const newCandidate = new Candidate({
      name: pendingCandidate.name,
      email: pendingCandidate.email,
      branch: pendingCandidate.branch,
    });
    await newCandidate.save();
  }

  // Remove pending candidate whether approved or rejected
  await pendingCandidate.remove();

  return res.status(200).json({ message: 'Decision processed successfully' });
});


///Send OTP to the Users for reset password : 
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: "atsapp23@gmail.com",
      pass: "espgvmcnayykcgbd"
  }
})

const generateOTP = ()=>{
      //0-9 6 length password 
      let otp =''
      let length = 6
      for(let i=0; i < length ; i++){
          const digit = Math.floor(Math.random()*10);
          otp += digit.toString()
      }
      return otp;
}


//For sending OTPs : 

app.post("/user/otp/send/:email", async (req, res) => {

  const { email} = req.params
  const mailOptions = {
      from: "TES-APP <atsapp23@gmail.com>",
      to: email,
      subject: `OTP for Forgot password.`,
      html: `
      <p>Hi ,</p>
      <p>Your ONE-TIME-PASSWORD(OTP) is ${generateOTP()} </p>
      `
  }
  transporter.sendMail(mailOptions, async (err, info) => {
      if (err) {
          res.send(err.message)
      } else {
          res.json({msg: "Email sent to user successfully.",gen_otp:generateOTP()})
      }
  })
})

//For update the passwords : 
app.post("/updatePassword/user/:email", async (req, res) => {
  try {
    const { newPassword } = req.body;
    const {email} =req.params
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the new password with the salt
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Find the evaluator by email
    const evaluator = await Evaluator.findOne({ email });
    console.log(evaluator)

    if (!evaluator) {
      return res.status(404).send("Evaluator not found");
    }

    // Update the password for the found evaluator
    evaluator.password = hashedPassword;

    // Save the updated evaluator to the database
    await evaluator.save();

    return res.send("Password updated successfully");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});



///Frontend Integration:
const _dirname = path.dirname("");
const builPath = path.join(_dirname, "./Client/build");
// app.use(express.static(builPath))
app.use(express.static(path.join(builPath)));
app.get("/*", function (req, res) {
  res.sendFile(
    "index.html",
    { root: path.join(_dirname, "./Client/build") },
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});