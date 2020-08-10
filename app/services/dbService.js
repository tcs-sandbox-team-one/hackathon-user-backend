require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const mongodb_url = process.env.MONGODB_URL;

console.log("Mongo Url is..... ", mongodb_url);

/****************DB Connection***************** */
mongoose
  .connect(mongodb_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to MongoDB.....");
  })
  .catch((error) => {
    console.error("Could not connect to MongoDB.... ", error);
  });

/*********************Schema****************** */

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phoneNo: Number,
  pincode: Number,
  address: String,
  age: Number,
  sex: String,
  bloodGroup: String,
  email: String,
  password: String,
  status: String,
});

const User = mongoose.model("user", userSchema, "users");

//User Registration
async function createUser(userJson) {
  try {
    const flag = await User.findOne({ email: userJson.email });
    if (!flag) {
      bcrypt.hash(userJson.password, 10, async function (err, hash) {
        userJson.password = hash;
        const user = new User(userJson);
        const result = await user.save();
        console.log("Created user successfully");
        return result;
      });
    } else {
      console.log("Exists!!");
      return -1;
    }
  } catch (err) {
    console.error("Error in user insert..", err);
    return null;
  }
}

//User Authentication
async function authenticateUser(email, password) {
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      const statusCode = match ? 200 : 500;
      return {
        statusCode,
        user,
      };
    } else
      return {
        statusCode: 400,
        message: "Wrong email id!",
      };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 404,
      message: "User not found",
    };
  }
}

//Book Hospital
async function bookHospital(email) {
  try {
    const user = User.findOneAndUpdate(
      { email: email },
      { status: "Booked" },
      { new: true }
    );
    return user;
  } catch (error) {
    console.error("Error in booking...", error);
  }
}

module.exports = {
  createUser,
  authenticateUser,
  bookHospital,
};
