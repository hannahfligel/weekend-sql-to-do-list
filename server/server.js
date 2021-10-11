// requires
const express = require( 'express' );
const app = express();
const bodyParser = require( 'body-parser' );
// must require modules to use them
const pool = require( './modules/pool' );
// uses
app.use( express.static( 'server/public' ) );
app.use( bodyParser.urlencoded( { extended: true } ) );

// globals
const port = 5000;

// spin up server
app.listen( port, ()=>{
    console.log( 'server up on:', port );
})

app.get('/todo', (req, res)=>{
    const queryString = `SELECT * FROM todo`//todo is the table name
    //get all todo list items from db
    //queryString is now the query that selects everything from the todo table
    pool.query( queryString ).then( (results)=>{
        res.send(results.rows);
    }).catch( (err)=>{
        console.log(err);
        res.sendStatus( 500 );
    })
})

app.post( '/todo', ( req, res )=>{
    console.log( '/todo POST:', req.body );
    const queryString = `INSERT INTO todo (task, category, due_date) VALUES ($1, $2, $3)`; //sanitize
    const values = [ req.body.task, req.body.category, req.body.due_date ]; 
    pool.query(queryString, values).then( (results)=>{ //results come from the database, responses come from the server 
        //201 is used when something is created
        res.sendStatus( 201 );
    }).catch( (err)=> {
        console.log(err);
        res.sendStatus(500);
    })
})

app.delete( '/todo', (req, res)=> {
    console.log( 'todo delete hit:', req.query );
    const queryString = `DELETE FROM todo WHERE id='${req.query.id}';`;
    pool.query( queryString ).then( ( results )=>{
        res.sendStatus(200);
    }).catch( (err)=>{
        res.sendStatus(500);
    })
})

app.put( '/todo', (req, res)=>{
    console.log( '/todo PUT req.query:', req.query );
    let queryString = `UPDATE "todo" SET status=TRUE WHERE id=${ req.query.id };`
    pool.query( queryString ).then( ( results )=>{
        res.sendStatus( 200 );
    }).catch( (err)=>{
        console.log( err );
        res.sendStatus( 500 );
    })
})
