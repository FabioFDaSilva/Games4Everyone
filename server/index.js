const express = require("express");
const authRoutes = require('./routes/auth-routes');
const gamesRoutes = require('./routes/games-routes');
const userRoutes = require('./routes/user-routes');
const ordersRoutes = require('./routes/orders-routes');
const order_itemsRoutes = require('./routes/order_items-routes');
const cors = require("cors");
const pool = require("./db");
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
const keys = require('./config/keys');
const bcrypt = require('bcrypt');

const app = express();
const port = 5000;

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
    console.log(user.id);
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        console.log("deserialize User");
        let googleUser = await pool.query("SELECT * FROM google_users WHERE id = $1", [id]);

        if (googleUser.rowCount > 0) {
            console.log("it's a google user");
            done(null, googleUser);
        }

        let localUser;
        if (Number.isInteger(id)) {
            console.log("Yep");
            localUser = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
            if (localUser.rowCount > 0) {
                console.log("it's a local user");
                done(null, localUser);
            }
        }

        console.log(localUser);



    } catch (err) {
        console.error(err.message);
    }


});

passport.use(new LocalStrategy({
    callbackURL: "/auth/login/redirect"
},
    async (username, password, cb) => {
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (user.rowCount < 1) {
            console.log("No user found!");
            return cb(null, false);
        }
        try {
            console.log("user found, comparing passwords");
            if (await bcrypt.compare(password, user.rows[0].password)) {
                console.log(`password matches, returning user`);
                console.log(user.rows[0]);
                return cb(null, user.rows[0]);
            } else {
                console.log(`passwords don't match!`);
                return cb(null, false);
            }
        } catch (e) {
            return cb(e);

        }
    }));




passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: "/auth/google/redirect"
},
    async (accessToken, refreshToken, profile, cb) => {
        try {
            // Check if user exists
            console.log("find user");
            const user = await pool.query("SELECT * FROM google_users WHERE id = $1", [profile.id])
            // If no user found, create new user
            if (user.rowCount === 0) {
                console.log("no user");
                const newUser = await pool.query("INSERT INTO google_users VALUES ($1,$2) RETURNING *", [profile.id, profile.displayName]);
                return cb(null, newUser);
            }
            console.log("user already exists, return profile");
            // User already exists, return profile
            return cb(null, profile);
        } catch (err) {
            console.log("error:");
            console.error(err.message);
        }
    }));

app.get("/getUser", (req, res, next) => {
    console.log("trying to get user");
    console.log(req.user);
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