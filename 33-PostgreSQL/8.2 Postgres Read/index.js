import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

let totalCorrect = 0;
let quiz = [];
let currentQuestion = {};

const db = new pg.Client({
  host: 'localhost',
  port: '5433',
  user: 'postgres',
  password: '1234',
  database: 'world'
})

db.connect()

db.query('SELECT * FROM flags', (err, result) => {
  if (err){
    console.log("Error executing query", err.stack);
  } else {
    quiz = result.rows
  }
  db.end()
})

function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
  console.log(currentQuestion);
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



// GET home page
app.get("/", (req, res) => {
  totalCorrect = 0;
  nextQuestion();
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.name.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
