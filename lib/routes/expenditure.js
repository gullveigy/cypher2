'use strict';

var _expenditures = require('../models/expenditures');

var _expenditures2 = _interopRequireDefault(_expenditures);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var mongoose = require('mongoose');

var mongodbUri = 'mongodb://expendituredb:expendituredb777@ds221271.mlab.com:21271/gullin';
//@ds221271.mlab.com:21271/gullin
//@ds251632.mlab.com:51632/gullexin
mongoose.connect(mongodbUri);

//mongoose.connect('mongodb://localhost:27017/expendituredb');
var db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

router.findAll = function (req, res) {
    //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    _expenditures2.default.find(function (err, expenditures) {
        if (err) res.send(err);

        res.send(expenditures, null, 5);
    });
};

router.findUserAll = function (req, res) {
    //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    _expenditures2.default.find({ "email": req.params.email }, function (err, expenditures) {
        if (err) res.send(err);

        res.send(expenditures, null, 5);
    });
};
//router.deleteAll = (req, res) => {
// Return a JSON representation of our list
//res.setHeader('Content-Type', 'application/json');

//Expenditure.remove(function(err) {
//if (err)
//res.json({ message: 'Expenditure Not Found!'});
//else
//res.json({ message: 'Expenditure Deleted Successfully!'});
//});
//}


router.findOne = function (req, res) {
    //find one record           get

    res.setHeader('Content-Type', 'application/json');

    _expenditures2.default.find({ "_id": req.params.id }, function (err, expenditure) {
        if (err) {
            res.status(404);
            res.json({ Message: 'Sorry! Cannot find the expenditure of this id!', errmsg: err });
        } else res.send(JSON.stringify(expenditure, null, 5));
    });
};

function getByValue(array, id) {
    var result = array.filter(function (obj) {
        return obj.id == id;
    });
    return result ? result[0] : null; // or undefined
}

function getTotalAmounts(array) {
    var totalAmounts = 0;
    array.forEach(function (obj) {
        totalAmounts += obj.amount;
    });
    return totalAmounts;
}

function compare(str) {
    //升序排列
    return function (obj1, obj2) {
        var value1 = obj1[str];
        var value2 = obj2[str];
        if (value2 < value1) {
            return 1;
        } else if (value2 > value1) {
            return -1;
        } else {
            return 0;
        }
    };
}

router.addExpenditure = function (req, res) {
    //post record               post

    res.setHeader('Content-Type', 'application/json');

    var expenditure = new _expenditures2.default();
    expenditure.email = req.body.email;
    expenditure.date = req.body.date;
    expenditure.payment = req.body.payment;
    expenditure.type = req.body.type;
    expenditure.amount = req.body.amount;
    expenditure.message = req.body.message;

    expenditure.save(function (err) {
        if (err) res.json({ message: 'Expenditure NOT Added!', errmsg: err });else res.json({ message: 'Expenditure Successfully Added!', data: expenditure });
    });
};

router.deleteExpenditure = function (req, res) {
    //delete record             delete

    _expenditures2.default.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.status(404);
            res.json({ message: 'Expenditure NOT DELETED!', errmsg: err });
        } else res.json({ message: 'Expenditure Successfully Deleted!' });
    });
};

router.findUserTotalAmounts = function (req, res) {
    //寻找支出总额               get

    _expenditures2.default.find({ "email": req.params.email }, function (err, expenditures) {
        //在出现的支出列表下面添加按钮找到支出总额，如果根本没有支出列表，那么就不会调用这个方法
        if (err) res.send(err);
        //res.json({ totalamounts : 0 });
        else res.json([{ totalamounts: getTotalAmounts(expenditures) }]);
    });
};

router.findUserMonthAmount = function (req, res) {
    //寻找每月支出额             get
    res.setHeader('Content-Type', 'application/json');
    //var keyword = {'date': {$regex:req.params.date, $options:'i'}};
    _expenditures2.default.find({ "email": req.params.email, "date": { $regex: req.params.date, $options: 'i' } }, function (err, expenditures) {
        if (expenditures.length <= 0) res.json({ Message: 'Sorry! Cannot find the expenditures of this month!' });
        //res.send(err);
        else res.json([{ monthlyamounts: getTotalAmounts(expenditures) }]);
    });
};

router.changeExpenditureinfo = function (req, res) {
    //put 记录的description             put

    _expenditures2.default.findById(req.params.id, function (err, expenditure) {
        if (err) {
            res.status(404);
            res.json({ Message: 'Sorry! Cannot find the expenditure by this id!' });
        } else {
            expenditure.message = req.body.message;
            expenditure.amount = req.body.amount;
            expenditure.date = req.body.date;
            expenditure.payment = req.body.payment;
            expenditure.type = req.body.type;
            expenditure.save(function () {
                if (err) res.json({ Message: 'Expenditure NOT Changed!', errmsg: err });else res.json({ Message: 'Expenditure Successfully Changed!', data: expenditure });
            });
        }
    });
};

router.findUserExByMessage = function (req, res) {
    //通过的description查找记录，fuzzysearch    get
    res.setHeader('Content-Type', 'application/json');
    //var keyword = {'description': {$regex:req.params.description, $options:'i'}};
    _expenditures2.default.find({ "email": req.params.email, 'message': { $regex: req.params.message, $options: 'i' } }, function (err, expenditure) {
        if (expenditure.length <= 0) res.json({ Message: 'Sorry! Cannot find this expenditure by this message!' });else res.send(JSON.stringify(expenditure, null, 5));
    });
};

/*router.deleteExpenditureByDate = (req, res) => {                                                       //通过date查找记录并删除 fuzzyseaarch      delete
    res.setHeader('Content-Type', 'application/json');
    var keyword = {'date': {$regex:req.params.date, $options:'i'}};
    Expenditure.remove(keyword, function(err) {
        if (err)
            res.json({ Message: 'Expenditure Not Deleted!',errmsg : err});
        else
            res.json({ Message: 'Expenditure Deleted Successfully!'});

        //res.json({ Message: 'Expenditure Deleted Successfully!'});
    });

}*/

module.exports = router;