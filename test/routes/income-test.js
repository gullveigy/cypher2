import chai from 'chai';
import chaiHttp from 'chai-http' ;
import server from '../../bin/www';
let expect = chai.expect;
import _ from 'lodash';
import things from 'chai-things'
chai.use( things);
chai.use(chaiHttp);

describe('Incomes', function (){
    // TODO
    describe('GET /incomes',  () => {
        it('should return all the income records in an array', function(done) {
            chai.request(server)
                .get('/incomes')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(4);
                    let result = _.map(res.body, (income) => {
                        return { message: income.message,
                                  amount: income.amount }
                    });
                    expect(result).to.include( { message: 'from Day', amount: 135  });
                    expect(result).to.include( { message: 'Parttime Coffee', amount: 24  } );
                    expect(result).to.include( { message: 'Sophara Return', amount: 70  } );
                    expect(result).to.include( { message: 'Others', amount: 230  } );
                    done();
                });

        });
    });






    describe('GET /:email/incomes',  () => {
        it('should return all the income records in an array', function(done) {
            chai.request(server)
                .get('/1804094745@qq.com/incomes')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(2);
                    let result = _.map(res.body, (income) => {
                        return { message: income.message,
                            amount: income.amount }
                    });
                    expect(result).to.include( { message: 'from Day', amount: 135  });
                    expect(result).to.include( { message: 'Parttime Coffee', amount: 24  } );
                    //expect(result).to.include( { message: 'Sophara Return', amount: 70  } );
                    //expect(result).to.include( { message: 'Others', amount: 230  } );
                    done();
                });

        });
    });


    describe('GET /incomes/:id', function () {
        it('should return a specific income record in an array', function(done) {
            chai.request(server)
                .get('/incomes/5c06b74a32a3c13b2c34dfbf')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (income) => {
                        return { message: income.message,
                            amount: income.amount }
                    });
                    expect(result).to.include( { message: "from Day", amount: 135  } );
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




    describe('GET /:email/incomes/fuzzy/:message',  () => {
        it('should return relevant income records matching the fuzzy description in an array', function(done) {
            chai.request(server)
                .get('/1804094745@qq.com/incomes/fuzzy/om')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (income) => {
                        return { message: income.message,
                            amount: income.amount }
                    });
                    expect(result).to.include(
                        { message: 'from Day', amount: 135 }
                    );
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });

        });
        it('should return a message for no relevant records', function(done) {
            chai.request(server)
                .get('/1804094745@qq.com/incomes/fuzzy/123')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    //expect(res.body.length).to.equal(0);
                    expect(res.body).to.have.property('Message','Sorry! Cannot find income by this message!' ) ;
                    done();
                });
        });

    });





    describe('GET /:email/incomes/tamounts',  () => {
        it('should return the total amounts of income records in an array', function(done) {
            chai.request(server)
                .get('/1804094746@qq.com/incomes/tamounts')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    //let result = _.map(res.body, (expenditure) => {
                    //return { description: expenditure.description,
                    //amount: expenditure.amount }
                    //});
                    expect(res.body).to.include({ totalamounts: 300 } );
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });

        });


    });





    describe('GET /:email/incomes/monthamount/:date',  () => {
        it('should return total amounts of income of one month in an array', function(done) {
            chai.request(server)
                .get('/1804094746@qq.com/incomes/monthamount/2018-11')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    //let result = _.map(res.body, (expenditure) => {
                    //return { description: expenditure.description,
                    //amount: expenditure.amount }
                    //});
                    expect(res.body).to.include({ monthamounts: 300 } );
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
                .get('/1804094745@qq.com/incomes/monthamount/2019-12')
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
                email: '1804094745@qq.com',
                date: '2018-12-04',
                incomingmode: 'card' ,
                amount: 120,
                message: 'bank return',
                type: 'wages'
            };
            chai.request(server)
                .post('/incomes')
                .send(income)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Income Successfully Added!' );
                    let income = res.body.data;
                    expect(income).to.include({message: 'bank return', date: '2018-12-04'});
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
                    email: '1804094745@qq.com',
                    message: 'from Day',
                    date: '2018-10-12',
                    incomingmode: 'Alipay',
                    amount: 130,
                    type: 'wages'
                };
                chai.request(server)
                    .put('/incomes/5c06b74a32a3c13b2c34dfbf/changeIninfo')
                    .send(income)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('Message').equal('Income Successfully Changed!');
                        let income = res.body.data;
                        expect(income).to.include({message: 'from Day', date: '2018-10-12',amount:130});
                        done();
                    });
            });
            after(function  (done) {
                chai.request(server)
                    .get('/incomes')
                    .end(function(err, res) {
                        let result = _.map(res.body, (income) => {
                            return { message: income.message,
                                      amount: income.amount };
                        }  );
                        expect(result).to.include( { message: 'from Day', amount: 130  } );
                        //done();
                    });
                let income = {
                    email: '1804094745@qq.com',
                    message: 'from Day',
                    date: '2018-10-12',
                    incomingmode: 'Alipay',
                    amount: 135,
                    type: 'wages'
                };
                chai.request(server)
                    .put('/incomes/5c06b74a32a3c13b2c34dfbf/changeIninfo')
                    .send(income)
                    .end(function (err, res) {
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
        describe('when id is valid', function () {
            it('should return a confirmation message and update database ', function (done) {
                chai.request(server)
                    .get('/incomes')
                    .end(function (err, res) {
                        const inId = res.body[4]._id;
                        chai.request(server)
                            .delete('/incomes/' + inId)
                            .end(function (err, res) {
                                expect(res).to.have.status(200);
                                expect(res.body).to.have.property('message', 'Income Successfully Deleted!');
                                done();
                            });
                    });

            });
            after(function (done) {
                chai.request(server)
                    .get('/incomes')
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        let result = _.map(res.body, function (income) {
                            return {
                                incomingmode: income.incomingmode,
                                amount: income.amount
                            };
                        });
                        //expect(result).to.have.lengthOf(1) ;
                        //expect(result).to.not.include( { paymenttype: 'Paypal', amount: 1600  } );
                        expect(result).to.not.include({incomingmode: 'card', amount: 120});
                        done();
                    });
            });  // end after
        });
        describe('when id is invalid', function () {
            it('should return a 404 and a message for invalid income id', function (done) {
                chai.request(server)
                    .delete('/incomes/1100001')
                    .end(function (err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('message', 'Income NOT DELETED!');
                        done();
                    });
            });

        });
    });









});
