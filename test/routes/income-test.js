let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
chai.use(require('chai-things'));
chai.use(chaiHttp);
let _ = require('lodash' );

describe('Incomes', function (){
    // TODO
    describe('GET /incomes',  () => {
        it('should return all the income records in an array', function(done) {
            chai.request(server)
                .get('/incomes')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(12);
                    let result = _.map(res.body, (income) => {
                        return { description: income.description,
                                  amount: income.amount }
                    });
                    expect(result).to.include( { description: 'benefits', amount: 78  });
                    expect(result).to.include( { description: 'wages', amount: 138  } );
                    expect(result).to.include( { description: 'wages', amount: 57  } );
                    expect(result).to.include( { description: 'benefits', amount: 48  } );
                    expect(result).to.include( { description: 'benefits', amount: 235  } );
                    expect(result).to.include( { description: 'wages', amount: 580  } );
                    expect(result).to.include( { description: 'wages', amount: 590  } );
                    expect(result).to.include( { description: 'wages', amount: 1200  } );
                    expect(result).to.include( { description: 'prize draw', amount: 46  } );
                    expect(result).to.include( { description: 'wages', amount: 1178  } );
                    expect(result).to.include( { description: 'prize draw', amount: 35  } );
                    expect(result).to.include( { description: 'benefits', amount: 47.5  } );
                    done();
                });

        });
    });



    describe('GET /incomes/:id', function () {
        it('should return a specific income record in an array', function(done) {
            chai.request(server)
                .get('/incomes/5bda4402467b3521a4b4a3a9')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (income) => {
                        return { description: income.description,
                            amount: income.amount }
                    });
                    expect(result).to.include( { description: "benefits", amount: 78  } );
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });

        });
        it('should return a 404 and a message for invalid income id', function(done) {
            chai.request(server)
                .get('/incomes/1100001')
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('Message','Sorry! Cannot find the income of this id!' ) ;
                    done();
                });
        });

    });





    describe('GET /incomes/daterecord/:date',  () => {
        it('should return specific income records of one date in an array', function(done) {
            chai.request(server)
                .get('/incomes/daterecord/2018-11-01')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (income) => {
                        return { description: income.description,
                            amount: income.amount }
                    });
                    expect(result).to.include( //{ description: 'RIP card', amount: 300  },
                        { description: 'wages', amount: 590 }
                    );
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });
        });
        it('should return a message for daterecord which do not exist', function(done) {
            chai.request(server)
                .get('/incomes/daterecord/2019-10-18')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    //expect(res.body.length).to.equal(0);
                    expect(res.body).to.have.property('Message','Sorry! Cannot find the income of this date!' ) ;
                    done();
                });
        });

    });




    describe('GET /incomes/inamountorder',  () => {
        it('should return all the income records in ascending order of amount in an array', function(done) {
            chai.request(server)
                .get('/incomes/inamountorder')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(12);
                    let result = _.map(res.body, (income) => {
                        return { description: income.description,
                            amount: income.amount }
                    });
                    expect(result).to.include( { description: 'prize draw', amount: 35  },
                        { description: 'prize draw', amount: 46 },
                        { description: 'benefits', amount: 47.5 },
                        { description: 'benefits', amount: 48 },
                        { description: 'wages', amount: 57 },
                        { description: 'benefits', amount: 78 },
                        { description: 'wages', amount: 138 },
                        { description: 'benefits', amount: 235 },
                        { description: 'wages', amount: 580 },
                        { description: 'wages', amount: 590 },
                        { description: 'wages', amount: 1178 },
                        { description: 'wages', amount: 1200 });
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });

        });
    });





    describe('GET /incomes/indateorder',  () => {
        it('should return all the income records in ascending order of date in an array', function(done) {
            chai.request(server)
                .get('/incomes/indateorder')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(12);
                    let result = _.map(res.body, (income) => {
                        return { description: income.description,
                            date: income.date }
                    });
                    expect(result).to.include( { description: 'benefits', date: '2018-10-01'  },
                        { description: 'benefits', date: '2018-10-07' },
                        { description: 'benefits', date: '2018-10-11' },
                        { description: 'benefits', date: '2018-10-15' },
                        { description: 'prize draw', date: '2018-10-15' },
                        { description: 'wages', date: '2018-10-19' },
                        { description: 'wages', date: '2018-10-25' },
                        { description: 'prize draw', date: '2018-10-29' },
                        { description: 'wages', date: '2018-11-01' },
                        { description: 'wages', date: '2018-11-06' },
                        { description: 'wages', date: '2018-11-08'},
                        { description: 'wages', date: '2018-11-18'} );
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });

        });
    });





    describe('GET /incomes/monthrecord/:date',  () => {
        it('should return income records of one month in ascending order of date in an array', function(done) {
            chai.request(server)
                .get('/incomes/monthrecord/2018-11')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(4);
                    let result = _.map(res.body, (income) => {
                        return { description: income.description,
                            date: income.date }
                    });
                    expect(result).to.include( { description: 'wages', date: '2018-11-01'  },
                        { description: 'wages', date: '2018-11-06' },
                        { description: 'wages', date: '2018-11-08' },
                        { description: 'wages', date: '2018-11-18' }
                    );
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });

        });
        it('should return a message for monthlyrecord cannot found', function(done) {
            chai.request(server)
                .get('/incomes/monthrecord/2019-12')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    //expect(res.body.length).to.equal(0);
                    expect(res.body).to.have.property('Message','Sorry! Cannot find the incomes of this month!' ) ;
                    done();
                });
        });

    });




    describe('GET /incomes/fuzzy/:description',  () => {
        it('should return relevant income records matching the fuzzy description in an array', function(done) {
            chai.request(server)
                .get('/incomes/fuzzy/pri')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(2);
                    let result = _.map(res.body, (income) => {
                        return { description: income.description,
                            amount: income.amount }
                    });
                    expect(result).to.include( { description: 'prize draw', amount: 46  },
                        { description: 'prize draw', amount: 35 }
                    );
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });

        });
        it('should return a message for no relevant records', function(done) {
            chai.request(server)
                .get('/incomes/fuzzy/123')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    //expect(res.body.length).to.equal(0);
                    expect(res.body).to.have.property('Message','Sorry! Cannot find income by this description!' ) ;
                    done();
                });
        });

    });





    describe('GET /incomes/tamounts',  () => {
        it('should return the total amounts of income records in an array', function(done) {
            chai.request(server)
                .get('/incomes/tamounts')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    //let result = _.map(res.body, (expenditure) => {
                    //return { description: expenditure.description,
                    //amount: expenditure.amount }
                    //});
                    expect(res.body).to.include({ totalamounts: 4232.5 } );
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });

        });


    });





    describe('GET /incomes/gettotal/:date',  () => {
        it('should return total amounts of income of one month in an array', function(done) {
            chai.request(server)
                .get('/incomes/monthamount/2018-11')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    //let result = _.map(res.body, (expenditure) => {
                    //return { description: expenditure.description,
                    //amount: expenditure.amount }
                    //});
                    expect(res.body).to.include({ monthamounts: 3548 } );
                    //{ description: 'books', amount: 15 }
                    //);
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });

        });
        it('should return a message for no relevant income records', function(done) {
            chai.request(server)
                .get('/incomes/monthamount/2019-12')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    //expect(res.body.length).to.equal(0);
                    expect(res.body).to.have.property('Message','Sorry! Cannot find the incomes of this month!' ) ;
                    done();
                });
        });

    });



    describe('POST /incomes', function () {
        it('should return confirmation message and update database', function(done) {
            let income = {
                username: 'diana',
                date: '2018-12-04',
                incomingmode: 'card' ,
                amount: 120,
                description: 'bank return'
            };
            chai.request(server)
                .post('/incomes')
                .send(income)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Income Successfully Added!' );
                    let income = res.body.data;
                    expect(income).to.include({description: 'bank return', date: '2018-12-04'});
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/incomes')
                .end(function(err, res) {
                    let result = _.map(res.body, (income) => {
                        return { incomingmode: income.incomingmode,
                            amount: income.amount };
                    }  );
                    expect(result).to.include( { incomingmode: 'card', amount: 120  } );
                    done();
                });
        });  // end-after
    });





    describe('PUT /incomes/:id/changeIninfo', () => {
        describe ('when id is valid',function() {
            it('should return a confirmation message and update database', function (done) {
                let income = {
                    username: 'diana',
                    description: 'bank return',
                    date: '2018-12-04',
                    incomingmode: 'card',
                    amount: 150
                };
                chai.request(server)
                    .put('/incomes/5bdf591e2cfb171be0c9ec33/changeIninfo')
                    .send(income)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('Message').equal('Income Successfully Changed!');
                        let income = res.body.data;
                        expect(income).to.include({description: 'bank return', date: '2018-12-04',amount:150});
                        done();
                    });
            });
            after(function  (done) {
                chai.request(server)
                    .get('/incomes')
                    .end(function(err, res) {
                        let result = _.map(res.body, (income) => {
                            return { description: income.description,
                                amount: income.amount };
                        }  );
                        expect(result).to.include( { description: 'bank return', amount: 150  } );
                        done();
                    });
            });  // end-after
        });
        describe('when id is invalid',function() {
            it('should return a 404 and a message for invalid income id', function (done) {
                chai.request(server)
                    .put('/incomes/1100001/changeIninfo')
                    .end(function (err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('Message', 'Sorry! Cannot find the income by this id!');
                        done();
                    });
            });
        });
    });






    describe('DELETE /incomes/:id', () => {
        describe ('when id is valid',function(){
            it('should return a confirmation message and update database ', function(done) {
                chai.request(server)
                    .delete('/incomes/5bdf591e2cfb171be0c9ec33')
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message','Income Successfully Deleted!' ) ;
                        done();
                    });

            });
            after(function  (done) {
                chai.request(server)
                    .get('/incomes')
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        let result = _.map(res.body, function(income) {
                            return { incomingmode: income.incomingmode,
                                amount: income.amount };
                        }  );
                        //expect(result).to.have.lengthOf(1) ;
                        //expect(result).to.not.include( { paymenttype: 'Paypal', amount: 1600  } );
                        expect(result).to.not.include( { incomingmode: 'card', amount: 150  } );
                        done();
                    });
            });  // end after
        });
        describe('when id is invalid',function(){
            it('should return a 404 and a message for invalid income id', function(done) {
                chai.request(server)
                    .delete('/incomes/1100001')
                    .end(function(err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('message','Income NOT DELETED!' ) ;
                        done();
                    });
            });

        });





        describe('DELETE /incomes/fuzzy/incomingmode',  () => {
            it('should return a confirmation message and update database ', function(done) {
                chai.request(server)
                    .delete('/incomes/fuzzy/car')
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('Message','Income Deleted Successfully!' ) ;
                        done();
                    });
            });
            after(function  (done) {
                chai.request(server)
                    .get('/incomes')
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        let result = _.map(res.body, function(income) {
                            return { date: income.date,
                                amount: income.amount };
                        }  );
                        //expect(result).to.have.lengthOf(1) ;
                        //expect(result).to.not.include( { paymenttype: 'Paypal', amount: 1600  } );
                        expect(result).to.not.include(
                            { date: '2018-09-04', amount: 120  });
                        done();
                    });
            });  // end after
        });


    });








});
