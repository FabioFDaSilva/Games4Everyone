const passport = require('passport');
const router = require('express').Router();


router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/google/redirect', passport.authenticate('google', { failureRedirect: 'http://localhost:3000/loginPage' }),
    function (req, res) {
        res.redirect('http://localhost:3000');
    });


router.get('/login', passport.authenticate('local', {
    failureRedirect: 'http://localhost:3000/loginPage',
}), function (req, res, next) {
    res.redirect('http://localhost:3000');
});

router.get('/logout', async (req, res, next) => {
    console.log("trying to log out");
    console.log(req.sessionID);
    if (req.sessionID) {
        req.logout();
        res.send("Done");
    }
});
module.exports = router;