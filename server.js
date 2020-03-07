const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

const { Pool } = require('pg')
const pool = new Pool({
    connectionString: 'postgres://ubtlfhpbj38tfn:p5100a09cb4d89b2b1b580c4e46dc8544b8d35e446433e4ca703aacdfc9542711@ec2-3-84-65-54.compute-1.amazonaws.com:5432/d3pmrrgfd42jnl',
    ssl: {
        rejectUnauthorized: false
    }
});


// create a GET route
app.get('/express_backend', (req, res) => {
    res.send({
        mind: 'no thoughts, head empty'
    });
});


app.get('/query', (req, res) => {
    var name = req.query.name
    var date = req.query.date
    console.log(date);

    //database connection
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query(`select name, tz, geo, grid, date from test where name='${name}' and date='${date}'`, (err, response) => {
            release()
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            res.send({
                data: response.rows
            })
        })

    })
})

//temps dropdown
app.get('/query_time', (req, res) => {
    var tz = req.query.tz

    //database connection
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query(`select tz, grid, name, geo, date from test where tz='${tz}'`, (err, response) => {
            release()
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            res.send({
                time: response.rows
            })
        })
    })
})

app.get('/query_save', (req, res) => {
    var name = req.query.name
    var grid = req.query.grid
    var tz = req.query.tz
    var date = req.query.date


    //database connection
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query(`insert into test (name, grid, tz, geo, date) Values ('${name}', '${grid}', '${tz}', '${date}')`, (err, response) => {
            release()
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            res.send({
                name: response.rows
            })
        })
    })
})
