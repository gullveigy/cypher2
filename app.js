var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const users = require("./routes/users");
const expenditure = require("./routes/expenditure");
const income = require("./routes/income");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.get('/users/:id/profile', users.findUserProfile); //test                  //yes      no
app.get('/users/:username/info', users.findOnebyUsername);                   //yes      no
app.get('/users', users.findAllusers);    //test                                //yes
app.get('/users/specificex/:username', users.findallexpenditures);//test    //yes      no
app.get('/users/specificin/:username', users.findallincomes);//test         //yes      no



app.get('/incomes', income.findAll);                                          //test
app.get('/incomes/monthrecord/:date', income.findMonthRecord);
app.get('/incomes/inamountorder', income.findAllinorder);                  //test
app.get('/incomes/indateorder', income.findAllindateorder);                //test
app.get('/incomes/tamounts', income.findTotalAmounts);                      //test
app.get('/incomes/fuzzy/:description', income.findByDescription);         //test
app.get('/incomes/daterecord/:date', income.findDateRecord);              //test
app.get('/incomes/monthamount/:date', income.findMonthAmount);//find total amounts in one month              //test
app.get('/incomes/:id', income.findOne);                                //test

app.get('/expenditures', expenditure.findAll);                               //test          //yes
app.get('/expenditures/monthrecord/:date', expenditure.findMonthRecord);                  //yes   no
app.get('/expenditures/inamountorder', expenditure.findAllinorder);        //test          //yes
app.get('/expenditures/indateorder', expenditure.findAllindateorder);      //test          //yes
app.get('/expenditures/tamounts', expenditure.findTotalAmounts);           //test            //yes
app.get('/expenditures/fuzzy/:description', expenditure.findByDescription);  //test          //yes          no
app.get('/expenditures/daterecord/:date', expenditure.findDateRecord);       //test            //yes         no
app.get('/expenditures/gettotal/:date', expenditure.findMonthAmount);//test                      //yes       no
app.get('/expenditures/:id', expenditure.findOne);           //test                                  //yes      no


app.post('/users',users.addUserBasic);  //test                                        //yes
app.post('/incomes',income.addIncome);                    //test
app.post('/expenditures',expenditure.addExpenditure);    //test                     //yes

app.delete('/users/:username', users.deleteUserByUsername);
app.delete('/incomes/:id', income.deleteIncome);          //test
app.delete('/incomes/fuzzy/:incomingmode', income.deleteByIncomingmode);        //test
//app.delete('/incomes', income.deleteAll);
app.delete('/expenditures/:id', expenditure.deleteExpenditure);      //test                                //yes
app.delete('/expenditures/fuzzydelete/:date', expenditure.deleteExpenditureByDate);   //test             //yes
//app.delete('/expenditures', expenditure.deleteAll);

app.put('/users/:id/addProfile', users.addExistUserProfile);//test                                            //yes    no
app.put('/expenditures/:id/changeExinfo', expenditure.changeExpenditureinfo);//test                          //yes   no
//app.put('/expenditures/:id/changeAmount', expenditure.changeAmount);//test
//app.put('/expenditures/:id/changeDate', expenditure.changeDate);//test
//app.put('/expenditures/:id/changePayment', expenditure.changePayment);//test
app.put('/incomes/:id/changeIninfo', income.changeIncomeinfo); //test
//app.put('/incomes/:id/changeAmount', income.changeAmount);//test
//app.put('/incomes/:id/changeDate', income.changeDate);//test
//app.put('/incomes/:id/changeIncomingmode', income.changeIncomingmode);//test



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});


if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;



