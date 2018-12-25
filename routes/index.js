const express = require('express');
const router = express.Router();
const Relative = require('../models/Relative');
const jwt = require('jsonwebtoken');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/authenticate', (req, res) => {
    const { email, password } = req.body;
    Relative.findOne({
        email,
        password
    }, (err, relative) => {
        if (err)
            throw err;

        if(!relative){
            res.json({
                status: false,
                message: 'Authentication failed!'
            });
        }else{
                const payload = {
                    geriatric_id:relative.geriatric_id
                };
                const token = jwt.sign(payload, req.app.get('API_SECRET_KEY'), {
                    expiresIn: 720 // 12 saat
                });

                res.json({
                    status: true,
                    token
                })

            /*
            bcrypt.compare(password, user.password).then((result) => {
                if (!result){
                    res.json({
                        status: false,
                        message: 'Authentication failed, wrong password.'
                    });
                }else{
                    const payload = {
                        geriatric_id:relative.geriatric_id
                    };
                    const token = jwt.sign(payload, req.app.get('api_secret_key'), {
                        expiresIn: 720 // 12 saat
                    });

                    res.json({
                        status: true,
                        token
                    })
                }
            });
            */
        }
    });

});

module.exports = router;
