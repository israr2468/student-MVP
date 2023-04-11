const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://127.0.0.1:5503/public'
}));
dotenv.config();

// console.log(process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// TEST
app.get('/test', (req, res) => {
  const err = null;
  if (err) {
    console.error(err);
    res.status(500).json({ error: 'Test Not Working' });
  } else {
    console.log('Test Working');
    res.status(200).send('Test Working');
  }
});

// READ - get all recipes
app.get('/api/recipes', (req, res) => {
    pool.query(`SELECT * FROM recipes`)
      .then((result) => {
        res.json(result.rows);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      });
});

// CRUD - create, read, update, delete
// CREATE
app.post('/api/recipes', (req, res) => {
    const { title, category, instructions, image_url, video_url, created_by } = req.body;
    if (!title || !category || !instructions || !created_by) {
      res.status(400).json({ error: 'Missing fields' });
    } else {
      pool.query(
        `INSERT INTO recipes(title, category, instructions, image_url, video_url, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [title, category, instructions, image_url, video_url, created_by]
      )
        .then((result) => {
          res.json(result.rows[0]);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
        });
    }
  });
  


// READ - get specific recipe by id
app.get('/api/recipes/:id', (req, res) => {
    const recipeId = req.params.id;
    pool.query(`SELECT * FROM recipes WHERE id = $1`, [recipeId])
      .then((result) => {
        if (result.rows.length === 0) {
          res.status(404).json({ error: `Recipe not found` });
        } else {
          res.json(result.rows[0]);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  });
  
  

// UPDATE - put
app.put('/api/recipes/:id', (req, res) => {
    const id = req.params.id;
    const { title, category, instructions, image_url, video_url, created_by } = req.body;
    if (!title || !category || !instructions || !created_by) {
      res.status(400).json({ error: 'Missing fields' });
    } else {
      pool.query(
        `UPDATE recipes SET title=$1, category=$2, instructions=$3, image_url=$4, video_url=$5, created_by=$6 WHERE id=$7 RETURNING *`,
        [title, category, instructions, image_url, video_url, created_by, id]
      )
        .then((result) => {
          if (result.rows.length === 0) {
            res.status(404).json({ error: `Recipe not found` });
          } else {
            res.json(result.rows[0]);
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
        });
    }
  });
  

// DELETE - specific to id
app.delete('/api/recipes/:id', (req, res) => {
    const recipeId = req.params.id;
    pool.query(`DELETE FROM recipes WHERE id = $1`, [recipeId])
    .then((result) => {
        if (result.rowCount === 0) {
            res.status(404).json({error: `Recipe not found`});
        } else {
            res.json({ message: `Recipe with ID ${recipeId} deleted successfully`});
        }
    })
    .catch((err) => {
        console.error(err)
        res.status(500).json({error: `Internal Server Error`});
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`);
})
