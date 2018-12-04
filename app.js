var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.get('/users/:email', users.findOnebyEmail);                   //yes      no
app.get('/users', users.findAllusers);    //test                                //yes
app.get('/users/specificex/:username', users.findallexpenditures);//test    //yes      no
app.get('/users/specificin/:username', users.findallincomes);//test         //yes      no



app.get('/incomes', income.findAll);//test
app.get('/:email/incomes', income.findUserAll );
app.get('/:email/incomes/tamounts', income.findUserTotalAmounts);                      //test
app.get('/:email/incomes/fuzzy/:message', income.findUserInByMessage);         //test
app.get('/:email/incomes/monthamount/:date', income.findUserMonthIncome);//find total amounts in one month              //test
app.get('/incomes/:id', income.findOne);                                //test

app.get('/expenditures', expenditure.findAll);//test          //yes
app.get('/:email/expenditures', expenditure.findUserAll );
app.get('/:email/expenditures/tamounts', expenditure.findUserTotalAmounts);           //test            //yes
app.get('/:email/fuzzyEx/:message', expenditure.findUserExByMessage);  //test          //yes          no
app.get('/:email/expenditures/gettotal/:date', expenditure.findUserMonthAmount);//test                      //yes       no
app.get('/expenditures/:id', expenditure.findOne);           //test                                  //yes      no


app.post('/users',users.addUser);  //test                                        //yes
app.post('/incomes',income.addIncome);                    //test
app.post('/expenditures',expenditure.addExpenditure);    //test                     //yes

app.delete('/users/:email', users.deleteUserByEmail);
app.delete('/incomes/:id', income.deleteIncome);          //test
app.delete('/expenditures/:id', expenditure.deleteExpenditure);      //test                                //yes

//yes    no
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



