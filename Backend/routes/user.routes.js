const express = require('express');
const validator = require("validator")
const userRouter = express.Router();
const { UserModel } = require('../model/user.model');
const { authRole } = require("../middlewares/role.middleware")
const upload = require("../middlewares/upload.middleware")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer")
const crypto = require('crypto');
const twilio = require('twilio');
const secreteKey = process.env.SECRET_KEY;
const password = process.env.PASSWORD;

// Twilio credentials (replace with your own)
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

// User Signup with OTP
userRouter.post('/signup', upload.single('Image'), async (req, res) => {
  const { Name, Email, PhoneNumber, Image, Password, role } = req.body;

  try {
    // Validation Criteria
    const isValidEmail = validator.isEmail(Email);
    const isValidMobile = /^[6789]\d{9}$/.test(PhoneNumber);

    if (!isValidEmail) {
      return res.status(400).send('Invalid email address.');
    }

    if (!isValidMobile) {
      return res.status(400).send('Invalid mobile number.');
    }

    const isUserPresent = await UserModel.findOne({ Email });
    if (isUserPresent) {
      return res.status(400).send('User already exists.');
    }

    // Generate a random 4-digit OTP
    const otp = crypto.randomInt(1000, 9999);

    bcrypt.hash(Password, 5, async (err, hash) => {
      if (err) {
        return res.status(400).send('Something went wrong.');
      }

      // Create a new user with OTP and save it to the database
      const user = new UserModel({ Name, Email, PhoneNumber, Password: hash, role, otp });

      if (req.file) {
        user.Image = req.file.path
      }

      await user.save();

      // Send OTP to the user's email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'batmaan00012@gmail.com',
          pass: password,
        },
      });

      const mailOptions = {
        from: 'batmaan00012@gmail.com',
        to: Email,
        subject: 'Verification OTP',
        text: `Your verification OTP is: ${otp}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).send('Failed to send OTP. Please try again later.');
        }
        console.log('Email sent: ' + info.response);
        res.status(200).send('User created successfully. Check your email for OTP verification.');
      });
    });

    // Send OTP via SMS using Twilio
    const message = await client.messages.create({
      body: `Your verification OTP is: ${otp}`,
      from: +12568278789,
      to: `+91${PhoneNumber}`, // User's phone number
    });

    console.log('OTP sent via SMS: ' + message.sid);

    res.status(200).send('User created successfully. Check your SMS for OTP verification.');
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});


//User Signin
userRouter.post('/signin', async (req, res) => {
  const { PhoneNumber, Password } = req.body

  try {
    // Validation Criteria
    const isValidMobile = /^[6789]\d{9}$/.test(PhoneNumber);

    if (!isValidMobile) {
      return res.status(400).send('Invalid mobile number.');
    }

    const user = await UserModel.findOne({ PhoneNumber })
    if (user) {
      const isPasswordMatch = await bcrypt.compare(Password, user.Password)

      if (isPasswordMatch) {
        const token = jwt.sign({ userID: user._id }, secreteKey)
        res.status(200).send({ "msg": "Login Successfull", token })
      } else {
        res.status(400).send("Wrong Password")
      }
    } else {
      res.status(400).send("SignIn Failed, User not found")
    }

  } catch (err) {
    res.status(400).send({ "msg": err.message })
  }
})


userRouter.get("/", authRole(['admin']), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).send({ "msg": "Authorization token missing" });
    }

    let decoded = jwt.verify(token, secreteKey);

    const data = await UserModel.find();
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({ "msg": err.message });
  }
});


userRouter.delete("/delete/:id", authRole(['admin']), async (req, res) => {
  const id = req.params.id;
  try {
    await UserModel.findByIdAndDelete({ _id: id })
    res.status(200).send("User Deleted Successfully")
  } catch (err) {
    res.status(400).send({ "msg": err.message })
  }
})


// OTP Verification Route with SMS verification
userRouter.post('/otp-verify', async (req, res) => {
  const { Email, OTP, PhoneNumber } = req.body;

  try {
    // Find the user by their email address
    const user = await UserModel.findOne({ Email });

    if (!user) {
      return res.status(400).send('User not found.');
    }

    // Check if the OTP matches
    if (user.otp !== OTP) {
      return res.status(400).send('Invalid OTP.');
    }

    // Check if the user's phone number matches
    if (user.PhoneNumber !== PhoneNumber) {
      return res.status(400).send('Phone number does not match.');
    }

    // Mark the user as verified
    user.isVerified = true;
    await user.save();

    res.status(200).send('OTP verification successful. You can now sign in.');

  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

module.exports = { userRouter }