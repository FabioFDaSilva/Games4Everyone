const passport = require('passport');
const router = require('express').Router();
const pool = require("../db");

router.post("/", async (req, res, next) => {
    try {
        if (Number.isInteger(req.body.user_id)) {
            const checkIdForLocal = await pool.query("SELECT id FROM users WHERE id = $1", [req.body.user_id]);

            if (checkIdForLocal.rowCount > 0) {
                const newOrder = await pool.query("INSERT INTO orders(user_id, address, price) VALUES ($1, $2, $3) RETURNING id", [req.body.user_id.toString(), req.body.address, req.body.price]);
                res.json(newOrder);
            }
        } else {
            const checkIdForGoogle = await pool.query("SELECT google_user_id FROM google_users WHERE google_user_id = $1", [req.body.user_id]);

            if (checkIdForGoogle.rowCount > 0) {
                const newOrder = await pool.query("INSERT INTO orders(user_id, address, price) VALUES ($1, $2, $3) RETURNING id", [req.body.user_id, req.body.address, req.body.price]);
                res.json(newOrder);
            }
        }



    } catch (error) {
        console.error(error.message);

    }
});

//Get existing order
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const myOrder = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
        res.json(myOrder);
    } catch (err) {
        console.error(err.message);
    }
})

//Delete existing order
router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleteOrder = await pool.query("DELETE FROM orders WHERE id = $1", [id]);

        res.json("Order deleted");

    } catch (err) {
        console.error(err.message);
    }
})


module.exports = router;