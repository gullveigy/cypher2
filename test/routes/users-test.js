import chai from 'chai';
import chaiHttp from 'chai-http' ;
//import server from '../../bin/www';
let server = null;
let expect = chai.expect;
import _ from 'lodash';
import things from 'chai-things'
chai.use( things);
chai.use(chaiHttp);

describe('Users', function (){
    // TODO
    before(function(){
        delete require.cache[require.resolve('../../bin/www')];
        delete require.cache[require.resolve('../../models/users')];
        server = require('../../bin/www');
    });
    after(function (done) {
        server.close(done);
    });

    describe('POST /users', function () {
        it('should return confirmation message and update database', function(done) {
            let user = {
                email: '1804094747@qq.com' ,
                password: '19293484857'
                //payment: 'Visa card' ,
                //amount: 300,
                //date: '2018-10-18'
            };
            chai.request(server)
                .post('/users')
                .send(user)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('User Successfully Added!' );
                    let user = res.body.data;
                    expect(user).to.include({email: '1804094747@qq.com', password: '19293484857'});
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/users')
                .end(function(err, res) {
                    let result = _.map(res.body, (user) => {
                        return { email: user.email,
                            password: user.password };
                    }  );
                    expect(result).to.include( { email: '1804094747@qq.com', password: '19293484857'  } );
                    done();
                });
        });  // end-after
    });






    describe('DELETE /users/:email', () => {
        it('should return a confirmation message and update database ', function(done) {
            chai.request(server)
                .delete('/users/1804094747@qq.com')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message','User Successfully Deleted!' ) ;
                    done();
                });

        });
        after(function  (done) {
            chai.request(server)
                .get('/users')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    let result = _.map(res.body, function(user) {
                        return { email: user.email,
                            password: user.password };
                    }  );
                    //expect(result).to.have.lengthOf(1) ;
                    //expect(result).to.not.include( { paymenttype: 'Paypal', amount: 1600  } );
                    expect(result).to.not.include( { email: '1804094747@qq.com', password: '19293484857'  } );
                    done();
                });
        });  // end after

    });




    describe('GET /users',  () => {
        it('should return all the users in an array', function(done) {
            chai.request(server)
                .get('/users')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(2);
                    let result = _.map(res.body, (user) => {
                        return { email: user.email,
                                  password: user.password }
                    });
                    expect(result).to.include( { email: "1804094745@qq.com", password: 'qwert'  } );
                    expect(result).to.include( { email: "1804094746@qq.com", password: '19970506' } );
                    //expect(result).to.include( { username: "Amber", password: '19293484857'  } );
                    //expect(result).to.include( { username: "zoe", password: 'zoe0914'  } );
                    done();
                });

        });
    });




    describe('GET /users/:email',  () => {
        it('should return a specific user matching the username in an array', function(done) {
            chai.request(server)
                .get('/users/1804094745@qq.com')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (user) => {
                        return { email: user.email,
                                  password: user.password, }
                    });
                    expect(result).to.include( { email: "1804094745@qq.com", password: 'qwert'  } );
                    //expect(result).to.include( { username: "charlotte", password: 'szmmhfsbl1997' } );
                    //expect(result).to.include( { username: "April", password: 'does19970506'  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });
        });
        it('should return a message for username that does not exist', function(done) {
            chai.request(server)
                .get('/users/1100001')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('Message','Sorry! Cannot find this user !' ) ;
                    done();
                });
        });

    });




 /*   describe('GET /users/specificex/:username',  () => {
        it('should return all the expenditure records of one user in an array', function(done) {
            chai.request(server)
                .get('/users/specificex/charlotte')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(4);
                    let result = _.map(res.body, (expenditure) => {
                        return { description: expenditure.description,
                                  amount: expenditure.amount }
                    });
                    expect(result).to.include( { description: 'eye shadow', amount: 16  } );
                    expect(result).to.include( { description: "nyx pencil", amount: 9.99  } );
                    expect(result).to.include( { description: "haribo", amount: 6  } );
                    expect(result).to.include( { description: "sunscreen cream", amount: 13  } );
                    done();
                });

        });
        it('should return a message for user has no expenditure records', function(done) {
            chai.request(server)
                .get('/users/specificex/charl')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('Message','You have no expenditures!' ) ;
                    done();
                });
        });

    });





    describe('GET /users/specificin/:username',  () => {
        it('should return all the income records of one user in an array', function(done) {
            chai.request(server)
                .get('/users/specificin/April')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(3);
                    let result = _.map(res.body, (income) => {
                        return { username: income.username,
                                  description: income.description,
                                  amount: income.amount }
                    });
                    expect(result).to.include( { username:'April',description: 'benefits', amount: 235  } );
                    expect(result).to.include( { username:'April',description: "wages", amount: 580  } );
                    expect(result).to.include( { username:'April',description: "wages", amount: 1200  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });

        });
        it('should return a message for user who has no income records', function(done) {
            chai.request(server)
                .get('/users/specificin/april')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('Message','You have no incomes!' ) ;
                    done();
                });
        });

    });
*/

});
