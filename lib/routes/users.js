'use strict';

var _users = require('../models/users');

var _users2 = _interopRequireDefault(_users);

var _expenditures = require('../models/expenditures');

var _expenditures2 = _interopRequireDefault(_expenditures);

var _incomes = require('../models/incomes');

var _incomes2 = _interopRequireDefault(_incomes);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var mongoose = require('mongoose');

var mongodbUri = 'mongodb://userdb:userdb777@ds221271.mlab.com:21271/gullin';

mongoose.connect(mongodbUri);

//mongoose.connect('mongodb://localhost:27017/expendituredb');
var db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/ //还要解禁


router.findAllusers = function (req, res) {
    //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    _users2.default.find(function (err, users) {
        if (err) res.send(err);

        res.send(JSON.stringify(users, null, 5));
    });
};

/*router.findUserProfile = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    User.find({ "_id" : req.params.id },function(err, user) {
        if (err) {
            res.status(404);
            res.json({message: 'User NOT Found!', errmsg: err});
        }else
        //var list = user.profile;
            res.send(JSON.stringify(user,null,5));
    });
}*/

//register process
router.addUser = function (req, res) {
    //post record               post

    res.setHeader('Content-Type', 'application/json');

    var user = new _users2.default();
    user.email = req.body.email;
    user.password = req.body.password;

    user.save(function (err) {
        if (err) res.json({ message: 'User NOT Added!', errmsg: err });else res.json({ message: 'User Successfully Added!', data: user });
    });
};

router.findOnebyEmail = function (req, res) {
    //find one record           get

    res.setHeader('Content-Type', 'application/json');

    _users2.default.find({ "email": req.params.email }, function (err, user) {
        if (user.length <= 0) {
            //res.status(404);
            res.json({ Message: 'Sorry! Cannot find this user !' });
        } else res.send(JSON.stringify(user, null, 5));
    });
};

router.deleteUserByEmail = function (req, res) {
    //delete record             delete

    _users2.default.remove({ "email": req.params.email }, function (err) {
        if (err) {
            res.status(404);
            res.json({ message: 'User NOT DELETED!', errmsg: err });
        } else res.json({ message: 'User Successfully Deleted!' });
    });
};

/*router.addExistUserProfile = (req, res) => {//add profile for exist user  PUT

    User.findById(req.params.id, function(err,user) {
        if (err) {
            res.status(404);
            res.json({message: 'User NOT Found!', errmsg: err});
        }else {
            user.profile.gender = req.body.profile.gender;
            user.profile.email = req.body.profile.email;
            user.profile.phone = req.body.profile.phone;
            user.save(function (err) {
                if (err)
                    res.json({ message: 'User NOT Changed!', errmsg : err } );
                else
                    res.json({ message: 'User Profile Successfully Updated!', data: user });
            });
        }
    });
}*/

//after login
router.findallexpenditures = function (req, res) {
    //if login sucessfully                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    _expenditures2.default.find({ "email": req.params.email }, function (err, expenditures) {
        if (expenditures.length <= 0) res.json({ Message: 'You have no expenditures!' });else if (err) {
            res.status(404);
            res.json({ Message: 'Sorry! Cannot find any expenditures!' });
        } else res.send(JSON.stringify(expenditures, null, 5));
    });
};

router.findallincomes = function (req, res) {
    //if login sucessfully                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    _incomes2.default.find({ "email": req.params.email }, function (err, incomes) {
        if (incomes.length <= 0) res.json({ Message: 'You have no incomes!' });else if (err) {
            res.status(404);
            res.json({ Message: 'Sorry! Cannot find any incomes!' });
        } else res.send(JSON.stringify(incomes, null, 5));
    });
};

module.exports = router;