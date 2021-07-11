const passport = require('passport');
const router = require('express').Router();
const pool = require("../db");
const bcrypt = require('bcrypt');

router.post("/", async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        console.log(hashedPassword);
        const checkUsernameAvailability = await pool.query("SELECT username FROM users WHERE username = $1", [req.body.username]);

        if (checkUsernameAvailability.rowCount === 0 && req.body.username !== "Guest") {
            const newUser = await pool.query("INSERT INTO users VALUES($1, $2, $3) RETURNING *", [req.body.username, hashedPassword, req.body.address]);
            res.json(newUser);
        }else{
            res.json("Username taken");
        }

    } catch (err) {
        console.error(err.message);
    }
})

///Update user

router.post("/:id"), async (req, res, next) => {
    try {
        const getUser = await pool.query("SELECT * FROM users WHERE id = $1 RETURNING ", [req.body.id]);
        res.json(getUser);
    } catch (err) {
        console.error(err.message);
    }
}
router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const thisUser = req.body;
        if (!thisUser.username || !thisUser.password || !thisUser.address) {
            try {
                const currentUser = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
                if (!thisUser.username) {
                    thisUser.username = currentUser.rows[0].username;
                }
                if (!thisUser.password) {
                    thisUser.password = currentUser.rows[0].password;
                }
                if (!thisUser.address) {
                    thisUser.address = currentUser.rows[0].address;
                }
            } catch (err) {
                console.error(err.message);
            }

        }

        const updatedUser = await pool.query("UPDATE users SET username = $1, password = $2, address = $3 WHERE id = $4", [thisUser.username, thisUser.password, thisUser.address, id]);

        res.json(updatedUser);


    } catch (err) {
        console.error(err.message);
    }
})

module.exports = router;