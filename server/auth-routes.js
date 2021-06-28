const passport = require('passport');
const router = require('express').Router();
const cors = require("cors");

router.use(cors());

router.get('/google', passport.authenticate('google', {
scope:['profile']}));

router.get('/google/redirect', passport.authenticate('google', {failureRedirect: '../loginPage'}), (req,res) =>{
    res.redirect('/');
})
router.get('/login', async(req,res,next) =>{
    ///handle with passport
    console.log("logging in");
    res.send("loggin in");
});

router.get('/logout', async(req,res,next)=>{
    console.log("logging out");
    res.send("logging out");

});

module.exports = router;