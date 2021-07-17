const passport = require('passport');
const router = require('express').Router();

router.use('/google', (req, res, next) => {
    console.log('req', req);
    next();
  });

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/google/redirect', passport.authenticate('google', { failureRedirect: 'http://localhost:3000/loginPage' }),
    function (req, res) {
        res.redirect('http://localhost:3000');
    });

router.get('/login/redirect', passport.authenticate('local', { failureRedirect: 'http://localhost:3000/loginPage' }),
    function (req, res) {
        res.redirect('http://localhost:3000');
    });

router.post('/login', passport.authenticate('local', {
    failureRedirect: 'http://localhost:3000/loginPage'
}), function (req, res, next) {
    req.login(req.user, (err) =>{
        if (err){
            res.status(500).json({ message: "Session save went bad."});
            return;
        }
        console.log("Trying to save");
        res.status(200).json({user: req.user});
    });
});

router.get('/logout', async (req, res, next) => {
    console.log("trying to log out");
    if (req.sessionID) {
        req.logout();
        res.send("Done");
    }
});

module.exports = router;