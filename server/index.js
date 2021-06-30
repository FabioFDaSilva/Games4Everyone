const express = require("express");
const authRoutes = require('./auth-routes');
const app = express();
const port = 5000;
const cors = require("cors");
const pool = require("./db");
const passport = require('passport');
const session = require('express-session');
require('./config/passport-setup');

app.set("view engine", "ejs");


//middleware


app.use(cors({origin: "http://localhost:3000", credentials: true}));
app.use(express.json());
app.use(passport.initialize());
app.use(session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true
}));

app.use(passport.session());
//app.use('/auth', authRoutes);


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
//Routes//

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
}));

app.get('/auth/google/redirect', passport.authenticate('google', { failureRedirect: '../loginPage' }), (req, res) => {
    res.redirect('/');
})
app.get('/auth/login', async (req, res, next) => {
    ///handle with passport
    console.log("logging in");
    res.send("loggin in");
});

app.get('/auth/logout', async (req, res, next) => {
    console.log("logging out");
    res.send("logging out");

});

///Select game based on ID
app.get("/games/:id", async (req,res,next) =>{
    try {  
        const {id} = req.params;
        const newItem = await pool.query("SELECT * FROM games WHERE id = $1", [id]);
        res.json(newItem);

    } catch (err) {
        console.error(err.message);
    }
});

//Query a game based on any factor
app.post("/store", async(req,res,next) =>{
    try {
        const query = req.body;
        

        let byName = [];
        let byPriceRange= [];
        let byMaxPrice= [];
        let byMainType = [];
        let bySecundaryType = [];
        let byTerciaryType = [];
        let byDurationRange = [];
        let byMaxDuration = [];

        
        if(query.name && query.name !== ""){
            byName = await pool.query("SELECT * FROM games WHERE name LIKE $1", [`%${query.name}%`]);
        }
        if((query.min_price && query.max_price) && (query.min_price !== "" && query.max_price !== "")){
            byPriceRange = await pool.query("SELECT * FROM games WHERE price < $1 AND price > $2", [query.max_price, query.min_price]);
        }
        if((query.max_price && !query.min_price) && (query.max_price !== "")){
           byMaxPrice = await pool.query("SELECT * FROM games WHERE price < $1", [query.max_price]);
        }
        if(query.main_game_type && query.main_game_type !== ""){
            byMainType = await pool.query("SELECT * FROM games WHERE main_game_type LIKE $1", [`%${query.main_game_type}%`]);
        }
        if(query.secundary_game_type && query.secundary_game_type !== ""){
            bySecundaryType = await pool.query("SELECT * FROM games WHERE secundary_game_type LIKE $1", [`%${query.secundary_game_type}%`]);
        }
        if(query.terciary_game_type && query.terciary_game_type !== ""){
            byTerciaryType = await pool.query("SELECT * FROM games WHERE terciary_game_type LIKE $1", [`%${query.terciary_game_type}%`]);
        }
        if((query.min_duration && query.max_duration) && (query.min_duration !== "" && query.max_duration !== "")){
            byDurationRange = await pool.query("SELECT * FROM games WHERE duration < $1 AND duration > $2", [query.max_duration, query.min_duration]);
        }
        if(query.max_duration && query.max_duration !== ""){
            byMaxDuration = await pool.query("SELECT * FROM games WHERE duration < $1", [query.max_duration]);
        }

        ///Make all rows from responses into sets
        const set0 = new Set(byName.rows);
        const set1 = new Set(byPriceRange.rows);
        const set2 = new Set(byMaxPrice.rows);
        const set3 = new Set(byMainType.rows);
        const set4 = new Set(bySecundaryType.rows);
        const set5 = new Set(byTerciaryType.rows);
        const set6 = new Set(byDurationRange.rows);
        const set7 = new Set(byMaxDuration.rows);
        ///create sets for the IDs
        let set0ID = new Set();
        let set1ID = new Set();
        let set2ID = new Set();
        let set3ID = new Set();
        let set4ID = new Set();
        let set5ID = new Set();
        let set6ID = new Set();
        let set7ID = new Set();

        ///assign every id in each set to its corresponding setID
        [...set0].map(item => set0ID.add(item.id));
        [...set1].map(item => set1ID.add(item.id));
        [...set2].map(item => set2ID.add(item.id));
        [...set3].map(item => set3ID.add(item.id));
        [...set4].map(item => set4ID.add(item.id));
        [...set5].map(item => set5ID.add(item.id));
        [...set6].map(item => set6ID.add(item.id));
        [...set7].map(item => set7ID.add(item.id));
        
        ///Merge all idsets
        const idSets = [set0ID, set1ID, set2ID, set3ID, set4ID, set5ID, set6ID, set7ID];

        ///Filter out anything that is empty
        const nonEmptySets = idSets.filter(s => s.size > 0);

        ///If the remaining sets contain any matching IDs, return those
        let commonElements;

        console.log(nonEmptySets.length);
        if(nonEmptySets.length > 0){
            commonElements = nonEmptySets.reduce((setA, setB) =>{
                const intersection = new Set();
                for (let elem of setB){
                    if (setA.has(elem)){
                        intersection.add(elem)
                    }
                }
                return intersection;
            }, nonEmptySets[0] || new Set());
        }

        
        ///Create a set of game objects
        const objectSets = [set0, set1, set2, set3, set4, set5, set6, set7];
        ///Filter out empty ones
        const nonEmptyObjectSets = objectSets.filter(s => s.size > 0);
        ///Organize them based on size
        const organizedSets = nonEmptyObjectSets.sort((a,b) => {return a.size - b.size});
        const commonElementsObjects = new Set();

        
        ///Go through each one, and add the objects to commonElementsObjects when their ID matches the commonElements
        let response;
        if(organizedSets.length > 0 ){
            [...organizedSets[0]].map(item =>{
                for(let i = 0; i < commonElements.size; i++){
                    if (commonElements.has(item.id)){
                        commonElementsObjects.add(item);
                    }
                }
                
            });
            response = [...commonElementsObjects];
        }
        else{
            response = "No Items Found";
        }
        

        ///Turn the set of common game objects into an array and send it as a response.
        console.log(response);
        res.json(response);
        
    } catch (err) {
        console.error(err.message);
    }
})

///Create new user
app.post("/users", async(req,res,next) =>{
    try {
        const {user} = req.body;
        const newUser = await pool.query("INSERT INTO users VALUES($1, $2, $3, $4) RETURNING *", [req.body.id, req.body.username, req.body.password, req.body.address]);
        res.json(newUser);
        
    } catch (err) {
        console.error(err.message);
        
    }
})

///Update user

app.post("/users/:id"), async(req,res,next) =>{
    try {
        const getUser = await pool.query("SELECT * FROM users WHERE id = $1", [req.body.id]);
        res.json(getUser);
    } catch (err) {
        console.error(err.message);
    }
}
app.put("/users/:id", async(req,res,next) =>{
    try {
        const {id} = req.params;
        const thisUser = req.body;
        if(!thisUser.username || !thisUser.password || !thisUser.address){
            try {
                    const currentUser = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
                    if(!thisUser.username){
                        thisUser.username = currentUser.rows[0].username;
                    }
                    if(!thisUser.password){
                        thisUser.password = currentUser.rows[0].password;
                    }
                    if(!thisUser.address){
                        thisUser.address = currentUser.rows[0].address;
                    }
            } catch (err) {
                console.error(err.message);
            }
           
        }
        
        const updatedUser = await pool.query("UPDATE users SET username = $1, password = $2, address = $3 WHERE id = $4",[thisUser.username, thisUser.password, thisUser.address, id]);

        res.json(updatedUser);


    } catch (err) {
        console.error(err.message);
    }
})

//Create new order_item

app.post("/order_items", async(req,res,next)=>{
    try {
        
        const {order_item} = req.body;
        const newOrder_item = await pool.query("INSERT INTO order_items VALUES($1, $2, $3)", [req.body.id, req.body.game_id, req.body.quantity]);
        res.json(newOrder_item);
    } catch (error) {
        console.error(error.message);
        
    }
});

// Update order_items

app.put("/order_items", async (req,res,next)=>{
    try {
        const updatedItem = await pool.query("UPDATE order_items SET game_id = $1, quantity = $2 WHERE id = $3", [req.body.game_id, req.body.quantity, req.body.id]);

        if (updatedItem){

            const game_value = await pool.query("SELECT price FROM games WHERE id = $1", [req.body.game_id]);
            try {
                const updateOrders = await pool.query("UPDATE orders SET price = $1 WHERE order_items_id = $2", [game_value.rows[0].price * req.body.quantity, req.body.id]);
            } catch (err) {
                console.error(err.message);
            }
            

        }
        res.json(updatedItem);
    } catch (error) {
        console.error(error.message);
    }
});
//Create new order

app.post("/orders", async(req,res,next) =>{
    try {

        const newOrder = await pool.query("INSERT INTO orders VALUES ($1, $2, $3, $4, $5)", [req.body.id, req.body.user_id, req.body.order_items_id, req.body.address, req.body.price]);

        res.json(newOrder);
    } catch (error) {
        console.error(error.message);
        
    }
});

//Get existing order
app.get("/orders/:id", async(req,res,next)=>{
    try {
        const {id} = req.params;
        const myOrder = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
        res.json(myOrder);
    } catch (err) {
        console.error(err.message);
    }
})

//Delete existing order
app.delete("/orders/:id", async(req,res,next)=>{
    try {
        const {id} = req.params;
        const deleteOrder = await pool.query("DELETE FROM orders WHERE id = $1", [id]);

        res.json("Order deleted");
        
    } catch (err) {
        console.error(err.message);
    }
})

/*
app.get();

app.delete();

app
*/
app.listen(port, () =>{
    console.log(`server started on port ${port}`);
});