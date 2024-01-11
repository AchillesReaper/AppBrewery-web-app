import express from "express";
import pg from 'pg'

const app = express();
const port = 3000;


const db = new pg.Client({
  host: 'localhost',
  port: '5433',
  user: 'postgres',
  password: '1234',
  database: 'world'
})

db.connect()
let visited_countries = []


app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET home page
app.get("/", async (req, res) => {
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = result.rows.map((row) => row.country_code)
  res.render("index.ejs", { countries: countries, total: countries.length });
  // db.end();
});

//INSERT new country
app.post('/add', async (req, res) => {
  const input = req.body.country

  console.log(`input = ${input}, type: ${typeof(input)}`);

  const qResult = await db.query(
    "select country_code from countries WHERE country_name  = $1",
    [input]
  )
  console.log(qResult.rows);
  console.log(`rowCount = ${qResult.rowCount}, type: ${typeof(qResult.rowCount)}`);

  if (qResult.rowCount == 1) {
    const countryCode = qResult.rows[0].country_code
    console.log(countryCode);
    await db.query(
      "INSERT INTO visited_countries (country_code) VALUES ($1)",
      [countryCode]
    )
  }
  res.redirect('/');

})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
