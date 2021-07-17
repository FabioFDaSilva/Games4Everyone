const passport = require('passport');
const router = require('express').Router();
const pool = require("../db");


router.post("/", async (req, res, next) => {
    try {
        const game_id_string = req.body.game_id.toString();
        const newOrderItem = await pool.query("INSERT INTO order_items (game_id, price, orders_id) VALUES ($1, $2, $3)", [game_id_string, req.body.price, req.body.order_id]);
        res.json(newOrderItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({status:"error"});

    }
});

// Update order_items

router.put("/", async (req, res, next) => {
    try {
        const updatedItem = await pool.query("UPDATE order_items SET quantity = $2 WHERE id = $3", [req.body.quantity, req.body.id]);

        if (updatedItem) {

            const game_value = await pool.query("SELECT price FROM games WHERE game_id = $1", [req.body.game_id]);
            try {
                const updateOrders = await pool.query("UPDATE orders SET price = $1 WHERE order_items_id = $2", [game_value.rows[0].price * req.body.quantity, req.body.id]);
            } catch (err) {
                console.error(err);
                res.status(500).json({status:"error"});
            }


        }
        res.json(updatedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({status:"error"});
    }
});

router.get("/:id", async(req,res,next) =>{
    try {
        const {id} = req.params;
        const fetchedOrderItem = await pool.query("SELECT * FROM order_items WHERE orders_id = $1", [id]);
        res.json(fetchedOrderItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({status:"error"});
    }
})


module.exports = router;