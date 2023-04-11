const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://127.0.0.1:5503'
}));
dotenv.config();

// console.log(process.env.DATABASE_URL);
const pool = new Pool ({
    connectionString: process.env.DATABASE_URL,
});

app.get('/test', (req, res) => {
    const err = null;
    if (err) {
        console.error(err);
        res.status(500).json({error: 'Test Not Working'})
    } else {
        console.log('Test Working')
    }
})

app.get('/api/recipes', (req, res) => {
    pool.query('SELECT * FROM recipes', (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error'});
        } else {
            res.json(result.rows)
        }
    })
})
// CRUD - create, read, update, delete 
// CREATE 
app.post('/api/recipes', (req, res) => {
    const { name, time, ingredients } = req.body;
    if (!name || !time || !ingredients) {
        res.status(400).json({ error: 'Missing fields' });
    } else {
        pool.query(`INSERT INTO recipes (name, time, ingredients) VALUES ($1, $2, $3) RETURNING *;`, [name, time, ingredients])
        .then((result) => {
            res.status(201).json(result.rows[0]);
        })
        .catch((err => {
            console.error(err);
            res.status(500).json({error: 'Internal Server Error'});
        }));
    }
});


// READ - specific to id
app.get('/api/recipes/:id', (req, res) => {
    const recipeId = req.params.id;
    pool.query(`SELECT * FROM recipes WHERE id = $1`, [recipeId])
    .then((result) => {
        if (result.rows.length === 0) {
            res.status(404).json({error: `Recipe not found`});
        } else {
            res.json(result.rows[0]);
        }
    })
    .catch((err) => {
        console.error(err)
        res.status(500).json({error: `Internal Server Error`});
    });
});


// UPDATE - put
app.put('/api/recipes/:id', (req, res) => {
    const id = req.params.id;
    const {name, time, ingredients} = req.body;
    if (!name || !time || !ingredients) {
        res.status(400).json({ error: 'Missing fields' });
    } else {
        pool.query(`UPDATE recipes SET name=$1, time=$2, ingredients=$3 WHERE id=$4 RETURNING *`, [name, time, ingredients, id])
        .then((result) => {
            if (result.rows.length === 0) {
                res.status(404).json({error: `Recipe not found`});
            } else {
                res.json(result.rows[0]);
            }
        })
        .catch((err => {
            console.error(err);
            res.status(500).json({error: 'Internal Server Error'});
        }));
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
