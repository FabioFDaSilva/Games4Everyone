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
const LocalStrategy = require('passport-local').Strategy;
const keys = require('./config/keys');
const bcrypt = require('bcrypt');

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


passport.serializeUser(function (user, done) {
    console.log("serialize user");
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        console.log("deserialize user");
        const googleUser = await pool.query("SELECT * FROM google_users WHERE id = $1", [id]);
        const localUser = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

        if(googleUser.rowCount > 0){
            
            done(null, googleUser);
        }
        else if (localUser.rowCount > 0){
            done(null, localUser);
        }
    } catch (err) {
        console.error(err.message);
    }


});

const authenticateUser = async (username, password, done) => {
    const user = await pool.query("SELECT * FROM users WHERE username = $1",[username]);
    
    
    const userInfo = {
        id: user.rows[0].id,
        username: user.rows[0].username
    }
    console.log(userInfo);
    if (user.rowCount < 1) {
        console.log("woops, rowcown < 1");
        return done(null, false, { message: "No user with that username" });
    }
    try {
        console.log("compare passwords");
        if (await bcrypt.compare(password, user.rows[0].password)) {
            console.log("they match");
            return done(null, userInfo);
        } else {
            console.log("they don't");
            return done(null, false, { message: "Password doesn't match!" });
        }
    } catch (e) {
        console.log("error");
        return done(e);

    }
}
passport.use(new LocalStrategy({}, authenticateUser));




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
            console.log("error:");
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

app.listen(port, () => {
    console.log(`server started on port ${port}`);
});