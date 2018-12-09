import chai from 'chai';
import chaiHttp from 'chai-http' ;
//import server from '../../bin/www';
let server = null;
let expect = chai.expect;
import _ from 'lodash';
import things from 'chai-things';
chai.use( things);
chai.use(chaiHttp);

describe('Expenditures', function (){
    // TODO
    before(function(){
        delete require.cache[require.resolve('../../bin/www')];
        delete require.cache[require.resolve('../../models/expenditures')];
        server = require('../../bin/www');
    });
    after(function (done) {
        server.close(done);
    });
    describe('POST /expenditures', function () {
        it('should return confirmation message and update database', function(done) {
            let expenditure = {
                email: '1804094745@qq.com',
                date: '2018-10-04',
                payment: 'Cash' ,
                amount: 10,
                message: 'glasses',
                type: 'Others'
            };
            chai.request(server)
                .post('/expenditures')
                .send(expenditure)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Expenditure Successfully Added!' );
                    let expenditure = res.body.data;
                    expect(expenditure).to.include({message: 'glasses', date: '2018-10-04'});
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
                    expect(result).to.include( { payment: 'Cash', amount: 10  } );
                    done();
                });
            //chai.request(server)
            //.delete('/expenditures/fuzzydelete/2018-12')
            //.end(function(err, res) {
            //done();
            //});
        });  // end-after
    });





    describe('PUT /expenditures/:id/changeExinfo', () => {
        describe ('when id is valid',function() {
            it('should return a confirmation message and update database', function (done) {
                let expenditure = {
                    email: '1804094745@qq.com',
                    message: 'latte',
                    date: '2018-10-01',
                    payment: 'we chat',
                    amount: 2.95,
                    type: 'repast'
                };
                chai.request(server)
                    .put('/expenditures/5c06a9d7bc2a6545387ddba2/changeExinfo')
                    .send(expenditure)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('Message').equal('Expenditure Successfully Changed!');
                        let expenditure = res.body.data;
                        expect(expenditure).to.include({message: 'latte', date: '2018-10-01'});
                        done();
                    });
            });
            after(function  (done) {
                chai.request(server)
                    .get('/expenditures')
                    .end(function(err, res) {
                        let result = _.map(res.body, (expenditure) => {
                            return { message: expenditure.message,
                                date: expenditure.date };
                        }  );
                        expect(result).to.include( { message: 'latte', date: '2018-10-01'  } );
                        //done();
                    });
                let expenditure = {
                    email: '1804094745@qq.com',
                    message: 'cup',
                    date: '2018-10-01',
                    payment: 'we chat',
                    amount: 2.95,
                    type: 'repast'
                };
                chai.request(server)
                    .put('/expenditures/5c06a9d7bc2a6545387ddba2/changeExinfo')
                    .send(expenditure)
                    .end(function (err, res) {
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
            //let exId;
            //before(function () {
            //chai.request(server)
            //.get('/expenditures')
            //.end(function(err, res) {
            //const exId = res.body[12]._id;
            //});
            //});
            it('should return a confirmation message and update database ', function(done) {
                chai.request(server)
                    .get('/expenditures')
                    .end(function(err, res) {
                        const exId = res.body[4]._id;
                        chai.request(server)
                            .delete('/expenditures/' + exId)
                            .end(function(err, res) {
                                expect(res).to.have.status(200);
                                expect(res.body).to.have.property('message','Expenditure Successfully Deleted!' ) ;
                                done();
                            });
                    });
                //.delete('/expenditures/' + exId)
                //.end(function(err, res) {
                //expect(res).to.have.status(200);
                //expect(res.body).to.have.property('message','Expenditure Successfully Deleted!' ) ;
                //done();
                //});

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
                        expect(result).to.not.include( { payment: 'Cash', amount: 10  } );
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








    describe('GET /expenditures',  () => {
        it('should return all the expenditures in an array', function(done) {
            chai.request(server)
                .get('/expenditures')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(4);
                    let result = _.map(res.body, (expenditure) => {
                        return { message: expenditure.message,
                            amount: expenditure.amount };
                    });
                    expect(result).to.include( { message: 'cup', amount: 2.95  });
                    expect(result).to.include( { message: 'JJ.Bus', amount: 3  } );
                    expect(result).to.include( { message: 'Railway', amount: 4  } );
                    expect(result).to.include( { message: 'milk cheese', amount: 1.95  } );
                    done();
                });

        });
    });




    describe('GET /:email/expenditures',  () => {
        it('should return all the income records in an array', function(done) {
            chai.request(server)
                .get('/1804094745@qq.com/expenditures')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(2);
                    let result = _.map(res.body, (expenditure) => {
                        return { message: expenditure.message,
                            amount: expenditure.amount };
                    });
                    expect(result).to.include( { message: 'cup', amount: 2.95  });
                    expect(result).to.include( { message: 'JJ.Bus', amount: 3  } );
                    //expect(result).to.include( { message: 'Sophara Return', amount: 70  } );
                    //expect(result).to.include( { message: 'Others', amount: 230  } );
                    done();
                });

        });
    });




    describe('GET /expenditures/:id', function () {
        it('should return a specific expenditure in an array', function(done) {
            chai.request(server)
                .get('/expenditures/5c06a9d7bc2a6545387ddba2')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (expenditure) => {
                        return { message: expenditure.message,
                            amount: expenditure.amount };
                    });
                    expect(result).to.include( { message: 'cup', amount: 2.95  } );
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });

        });
        it('should return a 404 and a message for invalid expenditure id', function(done) {
            chai.request(server)
                .get('/expenditures/1100001')
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('Message','Sorry! Cannot find the expenditure of this id!' ) ;
                    done();
                });
        });

    });






    describe('GET /:email/fuzzyEx/:message',  () => {
        it('should return relevant expenditure records matching the fuzzy description in an array', function(done) {
            chai.request(server)
                .get('/1804094745@qq.com/fuzzyEx/up')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (expenditure) => {
                        return { message: expenditure.message,
                            amount: expenditure.amount };
                    });
                    expect(result).to.include(
                        { message: 'cup', amount: 2.95 }
                    );
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });

        });
        it('should return a message for no relevant records', function(done) {
            chai.request(server)
                .get('/1804094745@qq.com/fuzzyEx/123')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    //expect(res.body.length).to.equal(0);
                    expect(res.body).to.have.property('Message','Sorry! Cannot find this expenditure by this message!' ) ;
                    done();
                });
        });

    });




    describe('GET /:email/expenditures/tamounts',  () => {
        it('should return the total amounts of expenditures in an array', function(done) {
            chai.request(server)
                .get('/1804094745@qq.com/expenditures/tamounts')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    //let result = _.map(res.body, (expenditure) => {
                    //return { description: expenditure.description,
                    //amount: expenditure.amount }
                    //});
                    expect(res.body).to.include({ totalamounts: 5.95 } );
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });

        });


    });




    describe('GET /:email/expenditures/gettotal/:date',  () => {
        it('should return total amounts of expenditure of one month in an array', function(done) {
            chai.request(server)
                .get('/1804094745@qq.com/expenditures/gettotal/2018-10')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    //let result = _.map(res.body, (expenditure) => {
                    //return { description: expenditure.description,
                    //amount: expenditure.amount }
                    //});
                    expect(res.body).to.include({ monthlyamounts: 5.95 } );
                    //{ description: 'books', amount: 15 }
                    //);
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });

        });
        it('should return a message for no relevant expenditure records', function(done) {
            chai.request(server)
                .get('/1804094745@qq.com/expenditures/gettotal/2018-12')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    //expect(res.body.length).to.equal(0);
                    expect(res.body).to.have.property('Message','Sorry! Cannot find the expenditures of this month!' ) ;
                    done();
                });
        });

    });









});
