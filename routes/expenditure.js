let Expenditure = require('../models/expenditures');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');


var mongodbUri ='mongodb://expendituredb:expendituredb777@ds221271.mlab.com:21271/gullin';
//@ds221271.mlab.com:21271/gullin
//@ds251632.mlab.com:51632/gullexin
mongoose.connect(mongodbUri);

//mongoose.connect('mongodb://localhost:27017/expendituredb');
let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});


router.findAll = (req, res) => {                                                                               //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Expenditure.find(function(err, expenditures) {
        if (err)
            res.send(err);

        res.send(expenditures,null,5);
    });
}


router.findUserAll = (req, res) => {                                                                               //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Expenditure.find({"email": req.params.email},function(err, expenditures) {
        if (err)
            res.send(err);

        res.send(expenditures,null,5);
    });
}
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





router.findOne = (req, res) => {                                                                              //find one record           get

    res.setHeader('Content-Type', 'application/json');

    Expenditure.find({ "_id" : req.params.id },function(err, expenditure) {
        if (err) {
            res.status(404);
            res.json({Message: 'Sorry! Cannot find the expenditure of this id!',errmsg:err});
        }else
            res.send(JSON.stringify(expenditure, null, 5));

    });
}

function getByValue(array, id) {
    var result  = array.filter(function(obj){return obj.id == id;} );
    return result ? result[0] : null; // or undefined
}

function getTotalAmounts(array) {
    let totalAmounts = 0;
    array.forEach(function(obj) { totalAmounts += obj.amount; });
    return totalAmounts;
}

function compare(str) {                                    //升序排列
    return function(obj1, obj2) {
        var value1 = obj1[str];
        var value2 = obj2[str]
        if (value2 < value1) {
            return 1;
        } else if (value2 > value1) {
            return -1;
        } else {
            return 0;
        }
    }
}



router.addExpenditure = (req, res) => {                                                                   //post record               post

    res.setHeader('Content-Type', 'application/json');

    var expenditure = new Expenditure();
    expenditure.email = req.body.email;
    expenditure.date = req.body.date;
    expenditure.payment = req.body.payment;
    expenditure.type = req.body.type;
    expenditure.amount = req.body.amount;
    expenditure.message = req.body.message;

    expenditure.save(function(err) {
        if (err)
            res.json({ message: 'Expenditure NOT Added!', errmsg : err } );
        else

            res.json({ message: 'Expenditure Successfully Added!', data: expenditure });
    });
}



router.deleteExpenditure = (req, res) => {                                                                      //delete record             delete

    Expenditure.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.status(404);
            res.json({message: 'Expenditure NOT DELETED!', errmsg: err});
        }else
            res.json({ message: 'Expenditure Successfully Deleted!'});
    });
}



router.findUserTotalAmounts = (req, res) => {                                                                    //寻找支出总额               get

    Expenditure.find({"email": req.params.email},function(err, expenditures) {//在出现的支出列表下面添加按钮找到支出总额，如果根本没有支出列表，那么就不会调用这个方法
        if (err)
            res.send(err);
        //res.json({ totalamounts : 0 });
        else
            res.json([{ totalamounts : getTotalAmounts(expenditures) }]);
    });
}



router.findUserMonthAmount = (req,res) => {                                                                     //寻找每月支出额             get
    res.setHeader('Content-Type', 'application/json');
    //var keyword = {'date': {$regex:req.params.date, $options:'i'}};
    Expenditure.find({"email":req.params.email,"date":{$regex:req.params.date, $options:'i'}}, function(err, expenditures) {
        if (expenditures.length <= 0)
            res.json({Message: 'Sorry! Cannot find the expenditures of this month!'});
        //res.send(err);
        else
            res.json([{ monthlyamounts : getTotalAmounts(expenditures) }]);
    });

}



router.changeExpenditureinfo = (req, res) => {                                                                //put 记录的description             put

    Expenditure.findById(req.params.id, function(err,expenditure) {
        if (err) {
            res.status(404);
            res.json({Message: 'Sorry! Cannot find the expenditure by this id!'});
        }else {
            expenditure.message = req.body.message;
            expenditure.amount = req.body.amount;
            expenditure.date = req.body.date;
            expenditure.payment = req.body.payment;
            expenditure.type = req.body.type;
            expenditure.save(function ( ) {
                if (err)
                    res.json({ Message: 'Expenditure NOT Changed!', errmsg: err});
                else
                    res.json({ Message: 'Expenditure Successfully Changed!', data: expenditure });
            });
        }
    });
}




router.findUserExByMessage = (req, res) => {                                                            //通过的description查找记录，fuzzysearch    get
    res.setHeader('Content-Type', 'application/json');
    //var keyword = {'description': {$regex:req.params.description, $options:'i'}};
    Expenditure.find({"email": req.params.email,'message':{$regex:req.params.message, $options:'i'}}, function(err,expenditure) {
        if (expenditure.length <= 0)
            res.json({Message: 'Sorry! Cannot find this expenditure by this message!'});
        else
            res.send(JSON.stringify(expenditure,null,5));
    });
}




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
