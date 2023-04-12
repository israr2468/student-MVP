const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const bodyParser = require('body-parser');

app.use(express.json());
app.use(cors({
    origin: 'http://127.0.0.1:5503'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

//GET all images
app.get('/api/images', (req, res) => {
    pool.query('SELECT * FROM images', (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error'});
        } else {
            res.json(result.rows)
        }
    })
})

//GET all details
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
app.post('/api/images', (req, res) => {
    const { name, image_link } = req.body;
    if (!name || !image_link) {
      res.status(400).json({ error: 'Missing fields' });
    } else {
      pool.query('INSERT INTO images (name, image_link) VALUES ($1, $2) RETURNING *', [name, image_link])
        .then(result => {
          res.status(201).json(result.rows[0]);
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
        });
    }
});
  

// READ - specific to id
app.get('/api/images/:id', (req, res) => {
    const imageId = req.params.id;
    pool.query(`SELECT * FROM images WHERE id = $1`, [imageId])
    .then((result) => {
        if (result.rows.length === 0) {
            res.status(404).json({error: `Image not found`});
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
app.put('/api/images/:id', (req, res) => {
    const id = req.params.id;
    const {name, image_link} = req.body;
    if (!name || !image_link) {
        res.status(400).json({ error: 'Missing fields' });
    } else {
        pool.query(`UPDATE images SET name=$1, image_link=$2 WHERE id=$3 RETURNING *`, [name, image_link, id])
        .then((result) => {
            if (result.rows.length === 0) {
                res.status(404).json({error: `Image not found`});
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


// if id is out of bound
// pg.query (`SELECT * FROM pets WHERE id = $1`,[petId]).then(result=>{
           
            
//     if (result.rows.length === 0) 
//         return next('error');
//     else {
//         const query = 'UPDATE pets SET age = COALESCE($1, age), kind = COALESCE($2, kind), name = COALESCE($3, name) WHERE id = $4 RETURNING *';
//         const values = [data.age || null, data.kind || null, data.name || null, petId]; //if value exists, add value to array if not set null
        
//         let key = Object.keys(req.body)[0];
//         let value = Object.values(req.body)[0];

//         // const query = `UPDATE pets SET ${key}=$1 WHERE id=$2 RETURNING *`;
//         // const values = [value, petId* 1];
//         pg.query(query,values).then(response=>{
//             let result = response.rows[0];
//             delete result.id;
//             res.json(result);
//         }).catch((e)=>{
//             e = new Error('Bad request: missing required parameter')
//             e.statusCode = 400;
//             return next(e);
//         })
//     }
// })


// DELETE - specific to id
app.delete('/api/images/:id', (req, res) => {
    const imageId = req.params.id;
    pool.query(`DELETE FROM images WHERE id = $1`, [imageId])
    .then((result) => {
        if (result.rowCount === 0) {
            res.status(404).json({error: `Recipe not found`});
        } else {
            res.json({ message: `Image with ID ${imageId} deleted successfully`});
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
