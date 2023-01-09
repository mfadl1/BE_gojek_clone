const { registerSchema, loginSchema } = require("../validate/validation");
const User = require("../models/user_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ACCES_TOKEN_EXPIRED_TIME = 86400 

exports.register = async (req, res) => {
    const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({message: error.message});

  //Check if the user is allready in the db
  const emailExists = await User.findOne({ email: req.body.email });

  if (emailExists) return res.status(409).json({message: "Email allready exists"});

  //hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //create new user
  const user = new User({
    name: req.body.name,
    phone_number: req.body.phone_number,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    const savedUser = await user.save();
    res.json({
        message: "Register succesfull",
        data: savedUser
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.login = async (req, res) => {
    const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({message: error.message});

  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).json({message: "Email or password is wrong"});

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).json({message: "Email or password is wrong"});

  //Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: ACCES_TOKEN_EXPIRED_TIME
  });
  res.status(200).json({
    message: "Login successfull",
    data: user,
    token_type: "Bearer",
    acces_token: token,
    expires_in: ACCES_TOKEN_EXPIRED_TIME
  });
};

exports.getProfile = (req, res) => {
    const access_token = req.headers['authorization'].split(" ")[1];
    const decoded_token = jwt.verify(access_token, process.env.TOKEN_SECRET)
    const user_id = decoded_token._id

    User.findById(user_id).exec((err, user) => {
        if (err) {
            return res.status(400).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    });
}

exports.updateProfile = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({message: "Email is already available"});

    const access_token = req.headers['authorization'].split(" ")[1];
    const decoded_token = jwt.verify(access_token, process.env.TOKEN_SECRET)
    const user_id = decoded_token._id

    const filter = { _id: user_id };

    //hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const updateDoc = {
        $set: {
          name: req.body.name,
          phone_number: req.body.phone_number,
          email: req.body.email,
          password: hashPassword
        },
      };
    
    User.findOneAndUpdate(filter, updateDoc, {
        new: true
    }).exec((error, result) => {
        if (error) {
            return res.status(400).json({ message: "User not found" });
        }
        return res.status(200).json({
            message: "Update profile succesfull", 
            data: result
        });
    });
}