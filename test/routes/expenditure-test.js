let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
chai.use(require('chai-things'));
chai.use(chaiHttp);
let _ = require('lodash' );

describe('Expenditures', function (){
    // TODO
    describe('POST /expenditures', function () {
        it('should return confirmation message and update database', function(done) {
            let expenditure = {
                username: 'April',
                date: '2018-12-04',
                payment: 'Visa card' ,
                amount: 10,
                description: 'glasses'
            };
            chai.request(server)
                .post('/expenditures')
                .send(expenditure)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Expenditure Successfully Added!' );
                    let expenditure = res.body.data;
                    expect(expenditure).to.include({description: 'glasses', date: '2018-12-04'});
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/expenditures')
                .end(function(err, res) {
                    let result = _.map(res.body, (expenditure) => {
                        return { payment: expenditure.payment,
                            amount: expenditure.amount };
                    }  );
                    expect(result).to.include( { payment: 'Visa card', amount: 10  } );
                    done();
                });
        });  // end-after
    });



    describe('PUT /expenditures/:id/changeExinfo', () => {
        describe ('when id is valid',function() {
            it('should return a confirmation message and update database', function (done) {
                let expenditure = {
                    username: 'April',
                    description: 'glasses and snack',
                    date: '2018-12-04',
                    payment: 'Visa card',
                    amount: 15
                };
                chai.request(server)
                    .put('/expenditures/5bdd88469dd67b3a4c06e09b/changeExinfo')
                    .send(expenditure)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('Message').equal('Expenditure Successfully Changed!');
                        let expenditure = res.body.data;
                        expect(expenditure).to.include({description: 'glasses and snack', date: '2018-12-04'});
                        done();
                    });
            });
            after(function  (done) {
                chai.request(server)
                    .get('/expenditures')
                    .end(function(err, res) {
                        let result = _.map(res.body, (expenditure) => {
                            return { description: expenditure.description,
                                amount: expenditure.amount };
                        }  );
                        expect(result).to.include( { description: 'glasses and snack', amount: 15  } );
                        done();
                    });
            });  // end-after
        });
        describe('when id is invalid',function() {
            it('should return a 404 and a message for invalid expenditure id', function (done) {
                chai.request(server)
                    .put('/expenditures/1100001/changeExinfo')
                    .end(function (err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('Message', 'Sorry! Cannot find the expenditure by this id!');
                        done();
                    });
            });
        });
    });



    describe('DELETE /expenditures/:id', () => {
        describe ('when id is valid',function(){
            it('should return a confirmation message and update database ', function(done) {
                chai.request(server)
                    .delete('/expenditures/5bdd88469dd67b3a4c06e09b')
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message','Expenditure Successfully Deleted!' ) ;
                        done();
                    });

            });
            after(function  (done) {
                chai.request(server)
                    .get('/expenditures')
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        let result = _.map(res.body, function(expenditure) {
                            return { payment: expenditure.payment,
                                      amount: expenditure.amount };
                        }  );
                        //expect(result).to.have.lengthOf(1) ;
                        //expect(result).to.not.include( { paymenttype: 'Paypal', amount: 1600  } );
                        expect(result).to.not.include( { payment: 'Visa card', amount: 15  } );
                        done();
                    });
            });  // end after
        });
        describe('when id is invalid',function(){
            it('should return a 404 and a message for invalid expenditure id', function(done) {
                chai.request(server)
                    .delete('/expenditures/1100001')
                    .end(function(err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('message','Expenditure NOT DELETED!' ) ;
                        done();
                    });
            });

        });

    });





    describe('DELETE /expenditures/fuzzydelete/:date',  () => {
        it('should return a confirmation message and update database ', function(done) {
            chai.request(server)
                .delete('/expenditures/fuzzydelete/2018-12')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('Message','Expenditure Deleted Successfully!' ) ;
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/expenditures')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    let result = _.map(res.body, function(expenditure) {
                        return { payment: expenditure.payment,
                                  amount: expenditure.amount };
                    }  );
                    //expect(result).to.have.lengthOf(1) ;
                    //expect(result).to.not.include( { paymenttype: 'Paypal', amount: 1600  } );
                    expect(result).to.not.include( { payment: 'cash', amount: 5.2  },
                                                    { payment: 'we chat', amount: 2.95  });
                    done();
                });
        });  // end after
    });


});
