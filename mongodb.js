const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');

mongoose.set("strictQuery", false);

mongoose
  .connect(
    "mongodb+srv://SurajNoSQLCloudDB:Suraj%401234@surajnosql.flrnigp.mongodb.net/todolistAppDB"
  )
  .then(() => {
    console.log("userDB created");
  })
  .catch((err) => {
    console.log(err);
  });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const secret="This is a secret";

userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});

const User = mongoose.model("User", userSchema);

// module.exports = User;

const taskSchema = mongoose.Schema({
  work: String,
  status: String,
});

const Task = mongoose.model("Task", taskSchema);



const customlistSchema = {
  listTitle: String,
  items: [taskSchema],
};

const List = mongoose.model("List", customlistSchema);

module.exports ={
    Task:Task,
    List:List,
    User:User
};