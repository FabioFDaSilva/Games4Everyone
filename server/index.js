const express = require("express");
const authRoutes = require('./routes/auth-routes');
const gamesRoutes = require('./routes/games-routes');
const userRoutes = require('./routes/user-routes');
const ordersRoutes = require('./routes/orders-routes');
const order_itemsRoutes = require('./routes/order_items-routes');
const app = express();
const port = 5000;
const cors = require("cors");
const pool = require("./db");
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const keys = require('./config/keys');
require('./config/passport-setup');

app.set("view engine", "ejs");


//////////////////////// START of middleware


app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);
app.use('/games', gamesRoutes);
app.use('/users', userRoutes);
app.use('/order_items', order_itemsRoutes);
app.use('/orders', ordersRoutes);


passport.serializeUser(function(user, done){
    done(null, user.rows[0].id);
});

passport.deserializeUser(async function(id, done){
    try {
        const user = await pool.query("SELECT * FROM google_users WHERE id = $1", [id]);
        done(null, user);
    } catch (err) {
        console.error(err.message);
    }
    
    
});


passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: "/auth/google/redirect"
},
    async (accessToken, refreshToken, profile, cb) => {
        try {
            // Check if user exists
            const user = await pool.query("SELECT * FROM google_users WHERE id = $1", [profile.id])
            console.log(user);
            // If no user found, create new user
            if (user.rowCount === 0) {
                const newUser = await pool.query("INSERT INTO google_users VALUES ($1,$2) RETURNING *", [profile.id, profile.displayName]);
                return cb(null, newUser);
            }
            // User already exists, return profile
            return cb(null, user);
        } catch (err) {
            console.log("erorr:");
            console.error(err.message);
        }
    }));

app.get("/getUser", (req, res, next) => {
    res.send(req.user);
});

app.get("/googleUsers/:googleId", async (req, res, next) => {
    try {
        const foundUser = await pool.query("SELECT * FROM users WHERE googleId = $1"[req.params]);
        res.json(foundUser);
    } catch (err) {
        console.error(err.message);
    }
});

/*
app.get();

app.delete();

app
*/
app.listen(port, () => {
    console.log(`server started on port ${port}`);
});