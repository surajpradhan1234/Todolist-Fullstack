const mongoose = require("mongoose");

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

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

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