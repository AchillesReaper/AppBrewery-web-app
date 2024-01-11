import express from "express";
import pg from 'pg'

const app = express();
const port = 3000;

let visitedCountries = []

const db = new pg.Client({
  host: 'localhost',
  port: '5433',
  user: 'postgres',
  password: '1234',
  database: 'world'
})

db.connect()

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

async function getVisitedCountries() {
  // get visited countries from database, return visitedCountries a new array or remain empty 
  const result = await db.query("SELECT country_code FROM visited_countries")
  try {
    visitedCountries = result.rows.map((row) => row.country_code)
  } catch (err) {
    console.log(err);
  }
}

// GET home page
app.get("/", async (req, res) => {
  getVisitedCountries()
  res.render("index.ejs", { countries: visitedCountries, total: visitedCountries.length })
});

//INSERT new country
app.post('/add', async (req, res) => {
  const input = req.body.country

  const qResult = await db.query(
    "select country_code from countries WHERE country_name  = $1",
    [input]
  )

  if (qResult.rowCount == 1) {
    getVisitedCountries()
    const countryCode = qResult.rows[0].country_code
    //check if country_code for the input country is visited
    const codeIndex = visitedCountries.findIndex((vc) => vc === countryCode)
    if (codeIndex < 0) {
      // input not yet exist
      await db.query(
        "INSERT INTO visited_countries (country_code) VALUES ($1)",
        [countryCode]
      )
      res.redirect('/');
    } else {
      console.log("Conunty has already been added. Try again");
      res.render('index.ejs', { countries: visitedCountries, total: visitedCountries.length, error: "Conunty has already been added. Try again" })
    }
  } else {
    res.render('index.ejs', { countries: visitedCountries, total: visitedCountries.length, error: "Country name does not exist. Try again" })
  }

})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
