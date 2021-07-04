const passport = require('passport');
const router = require('express').Router();
const pool = require("../db");

router.post("/", async (req, res, next) => {
    try {

        const newOrder = await pool.query("INSERT INTO orders VALUES ($1, $2, $3, $4, $5)", [req.body.id, req.body.user_id, req.body.order_items_id, req.body.address, req.body.price]);

        res.json(newOrder);
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