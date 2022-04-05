const userModel = require("../models/userModel.js")
const jwt = require("jsonwebtoken")
const validation = require("../middleware/validation")

// this file contain user registration and Login function

const registerUser = async (req, res) => {
    try {
        let data = req.body;
        if (Object.keys(data) == 0) {
            return res.status(400).send({ status: false, message: "No input (Data is required)" })
        }
        const { title, name, phone, email, password } = data;
        // line no 16-20 check the input field is provided or not
        if (!validation.valid(title)) { return res.status(400).send({ status: false, message: "input title" }) }
        if (!validation.isValidTitle(title)) { return res.status(400).send({ Satus: false, message: "Title can only be Mr , Mrs and Miss" }) }
        if (!validation.valid(name)) { return res.status(400).send({ status: false, message: "input name" }) }
        if (!validation.valid(phone)) { return res.status(400).send({ status: false, message: "input phone" }) }
        if (!validation.isValidPhone(phone)) {
            return res.status(400).send({ status: false, message: "Enter valid 10 digit indian mobile number don't use +91 " });
        }
        // checkin phone number is unique or not
        const phoneUnique = await userModel.findOne({ phone: data.phone })
        if (phoneUnique) { return res.status(400).send({ message: "phone already exists" }) }

        // checking the formate of email its in correct formate or not
        if (!validation.valid(email)) { return res.status(400).send({ status: false, message: "input email" }) }
        if (!validation.isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Enter  valid email address " });
        }
        // checking email is unique or not
        const emailExt = await userModel.findOne({ email: data.email })
        if (emailExt) { return res.status(400).send({ status: false, message: " Email already exists " }) }
        // checking the length which is atleast 8 or almost 15 character
        if (!validation.valid(password)) { return res.status(400).send({ status: false, msg: "input password" }) }
        if (password.length < 8 || password.length > 15) { return res.status(400).send({ status: false, message: "Password minimum length is 8 and maximum length is 15" }) }


        let saveData = await userModel.create(data);
        return res.status(201).send({ status: true, message: saveData })
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message });
    }
}


const loginUser = async (req, res) => {
    try {
        Data = req.body

        if (Object.keys(Data) == 0) { return res.status(400).send({ status: false, message: "Please provide email id or password" }) }
        const { email, password } = Data;   // destructuring data

       // checking that email id provided by users or not
        if (!validation.valid(email)) { return res.status(400).send({ status: false, message: "Insert email" }) }
        // is email in correct format or Not
        if (!validation.isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Enter valid email address" });
        }
        // checking that password length provided by users is correct
        if (!validation.valid(password)) { return res.status(400).send({ status: false, message: "Insert Password" }) }

        const findUser = await userModel.findOne({ email: email, password: password })
        if (!findUser) { return res.status(404).send({ status: false, message: "No user found" }) }

        const token = jwt.sign({
            userId: findUser._id,

        }, "Project-Three", { expiresIn: "24h" }  // expiresIn used for to give to to access token for a time.

        );

        return res.status(200).send({ status: true, message: "Successful Login", Token: token })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}



module.exports.loginUser = loginUser
module.exports.registerUser = registerUser