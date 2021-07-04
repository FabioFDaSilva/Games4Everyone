const passport = require('passport');
const router = require('express').Router();
const pool = require("../db");


router.post("/", async (req, res, next) => {
    try {

        const { order_item } = req.body;
        const newOrder_item = await pool.query("INSERT INTO order_items VALUES($1, $2, $3)", [req.body.id, req.body.game_id, req.body.quantity]);
        res.json(newOrder_item);
    } catch (error) {
        console.error(error.message);

    }
});

// Update order_items

router.put("/", async (req, res, next) => {
    try {
        const updatedItem = await pool.query("UPDATE order_items SET game_id = $1, quantity = $2 WHERE id = $3", [req.body.game_id, req.body.quantity, req.body.id]);

        if (updatedItem) {

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


module.exports = router;