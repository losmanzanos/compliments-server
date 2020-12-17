const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const path = require("path");
const PORT = process.env.PORT || 5000;

//Malcom in the Middleware...
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}

//ROUTES

//Create a compliment
app.post("/compliments", async (req, res) => {
  try {
    const { compliment } = req.body;
    const newCompliment = await pool.query(
      "INSERT INTO compliments (compliment) VALUES ($1) RETURNING *",
      [compliment]
    );

    res.json(newCompliment.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//Get ALL compliments
app.get("/compliments", async (req, res) => {
  try {
    const allCompliments = await pool.query("SELECT * FROM compliments");

    res.json(allCompliments.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Get a compliment
app.get("/compliments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const compliment = await pool.query(
      "SELECT * FROM compliments WHERE id = $1",
      [id]
    );

    res.json(compliment.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//Get a (RANDOM) compliment
app.get("/random", async (req, res) => {
  try {
    const randomCompliment = await pool.query("SELECT * FROM compliments");
    //console.log(randomCompliment.rows.length);

    res.json(
      randomCompliment.rows[
        Math.floor(Math.random() * randomCompliment.rows.length)
      ]
    );
  } catch (err) {
    console.error(err.message);
  }
});

//Update a compliment
app.put("/compliments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { compliment } = req.body;
    const updateCompliment = await pool.query(
      "UPDATE compliments SET compliment = $1 WHERE id = $2",
      [compliment, id]
    );

    res.json("Compliment was updated! 👍");
  } catch (err) {
    console.error(err.message);
  }
});

//Delete a compliment
app.delete("/compliments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCompliment = await pool.query(
      "DELETE FROM compliments WHERE id = $1",
      [id]
    );

    res.json("Compliment was deleted...");
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server started on PORT:${PORT}... 🤘`);
});
