const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const app = express();
require('dotenv').config()
const generateResponse = require("./routes/chat");
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.newsApi);


// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/sendArray", async (req, res) => {
  try {
    const ArrayData = req.body.data;
    const id=req.body.id;

    // Assuming chatRouter returns a promise
    const modifiedData = await generateResponse(ArrayData,id);
    console.log(modifiedData);

    res.json({ message: "Data received and processed successfully on the server", modifiedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//news





app.listen(3000, () => {
  console.log("Server started on port 3000");
});
