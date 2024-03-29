import express from "express";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  host: 'localhost',
  port: '5433',
  user: 'postgres',
  password: '1234',
  database: 'world'
})

db.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentMemberId = 1;
let members = [];
let visitedCountries = [];

async function getVisitedCountries() {
  // get visited countries from database, return visitedCountries a new array or remain empty 
  const result = await db.query("SELECT country_code FROM visited_countries_family WHERE members_id = $1", [currentMemberId])
  try {
    visitedCountries = result.rows.map((row) => row.country_code)
  } catch (err) {
    console.log(err);
  }
}

async function getFamilyMember() {
  // get all family members -> update global variable `members`
  const result = await db.query("SELECT * FROM members ")
  try {
    members = result.rows
  } catch (err) {
    console.log(err);
  }
}

// GET home page
app.get("/", async (req, res) => {
  await getVisitedCountries();
  await getFamilyMember();
  res.render("index.ejs", {
    countries: visitedCountries,
    total: visitedCountries.length,
    members: members,
    color: "teal",
  });
});



//INSERT new country
app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code) VALUES ($1)",
        [countryCode]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/member", async (req, res) => { });

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
