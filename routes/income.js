import Income from '../models/incomes';
import express from 'express';

let router = express.Router();
let mongoose = require('mongoose');


var mongodbUri ='mongodb://incomedb:incomedb777@ds221271.mlab.com:21271/gullin';

mongoose.connect(mongodbUri);

//mongoose.connect('mongodb://localhost:27017/incomedb');
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

    Income.find(function(err, incomes) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(incomes,null,5));
    });
}


router.findUserAll = (req, res) => {                                                                               //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Income.find({"email":req.params.email},function(err, incomes) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(incomes,null,5));
    });
}




router.findOne = (req, res) => {                                                                              //find one record           get

    res.setHeader('Content-Type', 'application/json');

    Income.find({ "_id" : req.params.id },function(err, income) {
        if (err) {
            res.status(404);
            res.json({Message: 'Sorry! Cannot find the income of this id!'});
        }else
            res.send(JSON.stringify(income,null,5));
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


/*router.findUserMonthRecord = (req,res) => {                                                                     //寻找每月支出额             get
    res.setHeader('Content-Type', 'application/json');
    //var keyword = {'date': {$regex:req.params.date, $options:'i'}};
    Income.find({"email":req.params.email,"date":{$regex:req.params.date, $options:'i'}}, function(err, incomes) {
        if (incomes.length <= 0)
            res.json({Message: 'Sorry! Cannot find the incomes of this month!'});
        //res.send(err);
        else
            var list = incomes.sort(compare("date"));
        res.send(JSON.stringify(list,null,5));
    });

}*/




router.addIncome = (req, res) => {                                                                   //post record               post

    res.setHeader('Content-Type', 'application/json');

    var income = new Income();
    income.email = req.body.email;
    income.date = req.body.date;
    income.incomingmode = req.body.incomingmode;
    income.amount = req.body.amount;
    income.message = req.body.message;
    income.type = req.body.type;

    income.save(function(err) {
        if (err)
            res.json({ message: 'Income NOT Added!', errmsg : err } );
        else

            res.json({ message: 'Income Successfully Added!', data: income });
    });
}




router.deleteIncome = (req, res) => {                                                                      //delete record             delete

    Income.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.status(404);
            res.json({message: 'Income NOT DELETED!', errmsg: err});
        }else
            res.json({ message: 'Income Successfully Deleted!'});
    });
}



router.findUserTotalAmounts = (req, res) => {                                                                    //寻找支出总额               get

    Income.find({"email":req.params.email},function(err, incomes) {//在出现的支出列表下面添加按钮找到支出总额，如果根本没有支出列表，那么就不会调用这个方法
        if (err)
            res.send(err);
        //res.json({ totalamounts : 0 });
        else
            res.json([{ totalamounts : getTotalAmounts(incomes) }]);
    });
}



router.changeIncomeinfo = (req, res) => {                                                                //put 记录的description             put

    Income.findById(req.params.id, function(err,income) {
        if (err) {
            res.status(404);
            res.json({Message: 'Sorry! Cannot find the income by this id!'});
        }else {
            income.message = req.body.message;
            income.date = req.body.date;
            income.incomingmode = req.body.incomingmode;
            income.amount = req.body.amount;
            income.type = req.body.type;
            income.save(function ( ) {
                if (err)
                    res.json({ Message: 'Income NOT Changed!', errmsg: err});
                else
                    res.json({ Message: 'Income Successfully Changed!', data: income });
            });
        }
    });
}






router.findUserInByMessage = (req, res) => {                                                            //通过的description查找记录，fuzzysearch    get
    res.setHeader('Content-Type', 'application/json');
    //var keyword = {'description': {$regex:req.params.description, $options:'i'}};
    Income.find({"email":req.params.email,"message":{$regex:req.params.message, $options:'i'}}, function(err,income) {
        if (income.length <= 0)
            res.json({Message: 'Sorry! Cannot find income by this message!'});
        else
            res.send(JSON.stringify(income,null,5));
    });
}



router.findUserMonthIncome = (req,res) => {                                                                     //寻找每月支出额             get
    res.setHeader('Content-Type', 'application/json');
    //var keyword = {'date': {$regex:req.params.date, $options:'i'}};
    Income.find({"email":req.params.email,"date":{$regex:req.params.date, $options:'i'}}, function(err, incomes) {
        if (incomes.length <= 0)
            res.json({Message: 'Sorry! Cannot find the incomes of this month!'});
        //res.send(err);
        else
            res.json([{ monthamounts : getTotalAmounts(incomes) }]);
    });

}


//router.findMonthlyBalance = (req,res) => {
//res.setHeader('Content-Type', 'application/json');
//var keyword = {'date': {$regex:req.params.date, $options:'i'}};
//Income.find(keyword, function(err, incomes) {
//if (err)
//res.send(err);
//else
//res.json({ totalamounts : getTotalAmounts(incomes) });
//});

//}

/*router.deleteByIncomingmode = (req, res) => {                                                       //通过incomingmode查找记录并删除 fuzzyseaarch      delete
    res.setHeader('Content-Type', 'application/json');
    var keyword = {'incomingmode': {$regex:req.params.incomingmode, $options:'i'}};
    Income.remove(keyword, function(err) {
        if (err)
            res.json({ Message: 'Income Not Deleted!',errmsg : err});
        else
            res.json({ Message: 'Income Deleted Successfully!'});

        //res.json({ Message: 'Expenditure Deleted Successfully!'});
    });

}*/









module.exports = router;
