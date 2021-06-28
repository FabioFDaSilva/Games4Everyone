const router = require('express').Router();


router.get('/google', async(req,res,next) =>{
    //handle with passport
    console.log("logging in with google");
    res.send("logging with google");
});
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