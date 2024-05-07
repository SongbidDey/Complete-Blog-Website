//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
require('dotenv').config()
// Define the schema for the Post
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

// Create a model from the schema
const Post = mongoose.model('Post', postSchema);

// Function to connect to the database and handle disconnections
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false
    });
    console.log('Connected to the database!');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

// To handle disconnects
mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from the database');
});

// To handle errors after initial connection
mongoose.connection.on('error', err => {
  console.error('Database connection error:', err);
});

// To close the connection when the Node.js process ends
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Disconnected from the database due to application termination');
  process.exit(0);
});

// Call the function to connect to the database
connectToDatabase();

// Export the Post model
// module.exports = Post;

// --------old code-----------
const homeStartingContent = "A blogging website is a platform where individuals or groups create and publish content regularly in the form of blog posts. These posts typically cover a wide range of topics, including personal experiences, opinions, tutorials, reviews, news, and more. Blogging websites can serve various purposes, such as sharing knowledge, expressing creativity, building a personal brand, promoting products or services, or generating revenue through advertising or sponsored content. By hitting COMPOSE button you can write your own blog title and content. Click Contact button to CONTACT with developer SONGBID DEY.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

// app.get("/", function(req, res){
//   Post.find({},function(err,posts){
//     if(!err){
//       res.render("home", {
//         startingContent: homeStartingContent,
//         posts: posts
//         });
//     }else{
//       console.log(err);
//     }
    
//   })
  
// });
app.get("/", async function(req, res){
  try {
    const posts = await Post.find({});
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving posts");
  }
});


app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});


app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.status(400).send("Unable to save to database");
    });
});
app.get("/posts/:postId",async function(req, res){
  const requestedPostId = req.params.postId;
  //const requestedTitle = _.lowerCase(req.params.postName);
    try{
      const post=await Post.findOne({_id:requestedPostId});
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }catch(err){
      console.log(err);
    }
});

app.listen(process.env.PORT, function() {
  console.log("Server started on port 3000");
});
