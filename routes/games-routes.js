const passport = require('passport');
const router = require('express').Router();
const pool = require("../db");

router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const newItem = await pool.query("SELECT * FROM games WHERE id = $1", [id]);
        res.json(newItem);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({status:err});
    }
});


//Query a game based on any factor
router.post("/", async (req, res, next) => {
    try {
        const query = req.body;


        let byName = [];
        let byPriceRange = [];
        let byMaxPrice = [];
        let byMainType = [];
        let bySecundaryType = [];
        let byTerciaryType = [];
        let byDurationRange = [];
        let byMinDuration =[];
        let byMaxDuration = [];
        let byDifficultyRange = [];
        let byMaxDifficulty = [];
        let byMinDifficulty = [];


        if (query.name && query.name !== "") {
            byName = await pool.query("SELECT * FROM games WHERE name LIKE $1", [`%${query.name}%`]);
        }
        if ((query.min_price && query.max_price) && (query.min_price !== "" && query.max_price !== "")) {
            byPriceRange = await pool.query("SELECT * FROM games WHERE price < $1 AND price > $2", [query.max_price, query.min_price]);
        }
        if ((query.max_price && !query.min_price) && (query.max_price !== "")) {
            byMaxPrice = await pool.query("SELECT * FROM games WHERE price < $1", [query.max_price]);
        }
        if (query.main_game_type && query.main_game_type !== "") {
            byMainType = await pool.query("SELECT * FROM games WHERE main_game_type LIKE $1", [`%${query.main_game_type}%`]);
        }
        if (query.secundary_game_type && query.secundary_game_type !== "") {
            bySecundaryType = await pool.query("SELECT * FROM games WHERE secundary_game_type LIKE $1", [`%${query.secundary_game_type}%`]);
        }
        if (query.terciary_game_type && query.terciary_game_type !== "") {
            byTerciaryType = await pool.query("SELECT * FROM games WHERE terciary_game_type LIKE $1", [`%${query.terciary_game_type}%`]);
        }
        if ((query.min_duration && query.max_duration) && (query.min_duration !== "" && query.max_duration !== "")) {
            byDurationRange = await pool.query("SELECT * FROM games WHERE duration < $1 AND duration > $2", [query.max_duration, query.min_duration]);
        }
        if (query.min_duration && query.min_duration !== "") {
            byMinDuration = await pool.query("SELECT * FROM games WHERE duration > $1", [query.min_duration]);
        }
        if (query.max_duration && query.max_duration !== "") {
            byMaxDuration = await pool.query("SELECT * FROM games WHERE duration < $1", [query.max_duration]);
        }
        if((query.min_difficulty && query.max_difficulty) && (query.min_difficulty !== "" && query.max_difficulty !== "")){
            byDifficultyRange = await pool.query("SELECT * FROM games WHERE difficulty < $1 AND difficulty > $2", [query.max_difficulty, query.min_difficulty]);
        }
        if(query.max_difficulty && query.max_difficulty !== ""){
            byMaxDifficulty = await pool.query("SELECT * FROM games WHERE difficulty <$1", [query.max_difficulty]);
        }
        if(query.min_difficulty && query.min_difficulty !== ""){
            byMinDifficulty = await pool.query("SELECT * FROM games WHERE difficulty >$1", [query.min_difficulty]);
        }


        ///Make all rows from responses into sets
        const set0 = new Set(byName.rows);
        const set1 = new Set(byPriceRange.rows);
        const set2 = new Set(byMaxPrice.rows);
        const set3 = new Set(byMainType.rows);
        const set4 = new Set(bySecundaryType.rows);
        const set5 = new Set(byTerciaryType.rows);
        const set6 = new Set(byDurationRange.rows);
        const set7 = new Set(byMinDuration.rows);
        const set8 = new Set(byMaxDuration.rows);
        const set9 = new Set(byDifficultyRange.rows);
        const set10 = new Set(byMaxDifficulty.rows);
        const set11 = new Set(byMinDifficulty.rows);
        ///create sets for the IDs
        let set0ID = new Set();
        let set1ID = new Set();
        let set2ID = new Set();
        let set3ID = new Set();
        let set4ID = new Set();
        let set5ID = new Set();
        let set6ID = new Set();
        let set7ID = new Set();
        let set8ID = new Set();
        let set9ID = new Set();
        let set10ID = new Set();
        let set11ID = new Set();

        ///assign every id in each set to its corresponding setID
        [...set0].map(item => set0ID.add(item.id));
        [...set1].map(item => set1ID.add(item.id));
        [...set2].map(item => set2ID.add(item.id));
        [...set3].map(item => set3ID.add(item.id));
        [...set4].map(item => set4ID.add(item.id));
        [...set5].map(item => set5ID.add(item.id));
        [...set6].map(item => set6ID.add(item.id));
        [...set7].map(item => set7ID.add(item.id));
        [...set8].map(item => set8ID.add(item.id));
        [...set9].map(item => set9ID.add(item.id));
        [...set10].map(item => set10ID.add(item.id));
        [...set11].map(item => set11ID.add(item.id));

        ///Merge all idsets
        const idSets = [set0ID, set1ID, set2ID, set3ID, set4ID, set5ID, set6ID, set7ID, set8ID, set9ID, set10ID, set11ID];

        ///Filter out anything that is empty
        const nonEmptySets = idSets.filter(s => s.size > 0);

        ///If the remaining sets contain any matching IDs, return those
        let commonElements;
        if (nonEmptySets.length > 0) {
            commonElements = nonEmptySets.reduce((setA, setB) => {
                const intersection = new Set();
                for (let elem of setB) {
                    if (setA.has(elem)) {
                        intersection.add(elem)
                    }
                }
                return intersection;
            }, nonEmptySets[0] || new Set());
        }


        ///Create a set of game objects
        const objectSets = [set0, set1, set2, set3, set4, set5, set6, set7, set8, set9, set10, set11];
        ///Filter out empty ones
        const nonEmptyObjectSets = objectSets.filter(s => s.size > 0);
        ///Organize them based on size
        const organizedSets = nonEmptyObjectSets.sort((a, b) => { return a.size - b.size });
        const commonElementsObjects = new Set();


        ///Go through each one, and add the objects to commonElementsObjects when their ID matches the commonElements
        let response;
        if (organizedSets.length > 0) {
            [...organizedSets[0]].map(item => {
                for (let i = 0; i < commonElements.size; i++) {
                    if (commonElements.has(item.id)) {
                        commonElementsObjects.add(item);
                    }
                }

            });
            response = [...commonElementsObjects];
        }
        else {
            response = "No Items Found";
        }


        ///Turn the set of common game objects into an array and send it as a response.
        res.json(response);

    } catch (err) {
        console.error(err);
        res.status(500).json({status:"error"});
    }
});

module.exports = router;