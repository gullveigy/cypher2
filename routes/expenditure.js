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

        res.send(JSON.stringify(expenditures,null,5));
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

router.findDateRecord = (req, res) => {                                                                      //find date record            get

    res.setHeader('Content-Type', 'application/json');

    Expenditure.find({ "date" : req.params.date },function(err, expenditure) {
        if (expenditure.length <= 0)
            res.json({Message: 'Sorry! Cannot find the expenditure of this date!'});
        else
            res.send(JSON.stringify(expenditure,null,5));
    });
}


router.findMonthRecord = (req,res) => {                                                                     //寻找每月支出额             get
    res.setHeader('Content-Type', 'application/json');
    var keyword = {'date': {$regex:req.params.date, $options:'i'}};
    Expenditure.find(keyword, function(err, expenditures) {
        if (expenditures.length <= 0)
            res.json({Message: 'Sorry! Cannot find the expenditures of this month!'});
        //res.send(err);
        else
            var list = expenditures.sort(compare("date"));
        res.send(JSON.stringify(list,null,5));
    });

}




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









router.findAllinorder = (req, res) => {                                                                               //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Expenditure.find(function(err, expenditures) {
        if (err)
            res.send(err);
        else {
            var list = expenditures.sort(compare("amount"));

            res.send(JSON.stringify(list, null, 5));
        }
    });
}



router.findAllindateorder = (req, res) => {                                                                               //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Expenditure.find(function(err, expenditures) {
        if (err)
            res.send(err);
        else {
            var list = expenditures.sort(compare("date"));

            res.send(JSON.stringify(list, null, 5));
        }
    });
}






router.addExpenditure = (req, res) => {                                                                   //post record               post

    res.setHeader('Content-Type', 'application/json');

    var expenditure = new Expenditure();
    expenditure.username = req.body.username;
    expenditure.date = req.body.date;
    expenditure.payment = req.body.payment;
    expenditure.amount = req.body.amount;
    expenditure.description = req.body.description;

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



router.findTotalAmounts = (req, res) => {                                                                    //寻找支出总额               get

    Expenditure.find(function(err, expenditures) {//在出现的支出列表下面添加按钮找到支出总额，如果根本没有支出列表，那么就不会调用这个方法
        if (err)
            res.send(err);
        //res.json({ totalamounts : 0 });
        else
            res.json([{ totalamounts : getTotalAmounts(expenditures) }]);
    });
}



router.findMonthAmount = (req,res) => {                                                                     //寻找每月支出额             get
    res.setHeader('Content-Type', 'application/json');
    var keyword = {'date': {$regex:req.params.date, $options:'i'}};
    Expenditure.find(keyword, function(err, expenditures) {
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
            expenditure.description = req.body.description;
            expenditure.amount = req.body.amount;
            expenditure.date = req.body.date;
            expenditure.payment = req.body.payment;
            expenditure.save(function ( ) {
                if (err)
                    res.json({ Message: 'Expenditure NOT Changed!', errmsg: err});
                else
                    res.json({ Message: 'Expenditure Successfully Changed!', data: expenditure });
            });
        }
    });
}




/*router.changeAmount = (req, res) => {                                                                //put 记录的description             put

    Expenditure.findById(req.params.id, function(err,expenditure) {
        if (err) {
            res.status(404);
            res.json({Message: 'Sorry! Cannot find the expenditure by this id!'});
        }else {
            expenditure.amount = req.body.amount;
            expenditure.save(function ( ) {
                if (err)
                    res.json({ Message: 'Expenditure NOT Changed!', errmsg: err});
                else
                    res.json({ Message: 'Expenditure Successfully Changed!', data: expenditure });
            });
        }
    });
}*/


/*router.changeDate = (req, res) => {                                                                //put 记录的description             put

    Expenditure.findById(req.params.id, function(err,expenditure) {
        if (err) {
            res.status(404);
            res.json({Message: 'Sorry! Cannot find the expenditure by this id!'});
        }else {
            expenditure.date = req.body.date;
            expenditure.save(function ( ) {
                if (err)
                    res.json({ Message: 'Expenditure NOT Changed!', errmsg: err});
                else
                    res.json({ Message: 'Expenditure Successfully Changed!', data: expenditure });
            });
        }
    });
}*/



/*router.changePayment = (req, res) => {                                                                //put 记录的description             put

    Expenditure.findById(req.params.id, function(err,expenditure) {
        if (err) {
            res.status(404);
            res.json({Message: 'Sorry! Cannot find the expenditure by this id!'});
        }else {
            expenditure.payment = req.body.payment;
            expenditure.save(function ( ) {
                if (err)
                    res.json({ Message: 'Expenditure NOT Changed!', errmsg: err});
                else
                    res.json({ Message: 'Expenditure Successfully Changed!', data: expenditure });
            });
        }
    });
}*/



router.findByDescription = (req, res) => {                                                            //通过的description查找记录，fuzzysearch    get
    res.setHeader('Content-Type', 'application/json');
    var keyword = {'description': {$regex:req.params.description, $options:'i'}};
    Expenditure.find(keyword, function(err,expenditure) {
        if (expenditure.length <= 0)
            res.json({Message: 'Sorry! Cannot find this expenditure by description!'});
        else
            res.send(JSON.stringify(expenditure,null,5));
    });
}




router.deleteExpenditureByDate = (req, res) => {                                                       //通过date查找记录并删除 fuzzyseaarch      delete
    res.setHeader('Content-Type', 'application/json');
    var keyword = {'date': {$regex:req.params.date, $options:'i'}};
    Expenditure.remove(keyword, function(err) {
        if (err)
            res.json({ Message: 'Expenditure Not Deleted!',errmsg : err});
        else
            res.json({ Message: 'Expenditure Deleted Successfully!'});

        //res.json({ Message: 'Expenditure Deleted Successfully!'});
    });

}





module.exports = router;
