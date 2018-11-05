let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
chai.use(require('chai-things'));
chai.use(chaiHttp);
let _ = require('lodash' );

describe('Users', function (){
    // TODO
    describe('POST /users', function () {
        it('should return confirmation message and update database', function(done) {
            let user = {
                username: 'Amber' ,
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
                    expect(user).to.include({username: 'Amber', password: '19293484857'});
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/users')
                .end(function(err, res) {
                    let result = _.map(res.body, (user) => {
                        return { username: user.username,
                                  password: user.password };
                    }  );
                    expect(result).to.include( { username: 'Amber', password: '19293484857'  } );
                    done();
                });
        });  // end-after
    });



    describe('PUT /users/:id/addProfile', () => {
        describe ('when id is valid',function() {
            it('should return a message and the information of this user updated', function (done) {
                let user = {
                    profile: {
                        gender: 'female',
                        //email: '1804094745@qq.com',
                        phone: '166629816182',
                        email: null
                    }
                };
                chai.request(server)
                    .put('/users/5bdde8b12f4b334e88f8d29f/addProfile')
                    .send(user)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        //let user = res.body.data ;
                        expect(res.body).to.have.property('message', 'User Profile Successfully Updated!');
                        //expect(res.body).to.have.property('message').equal('Expenditure Successfully Added!' );
                        let profile = res.body.data.profile;
                        expect(profile).to.include({gender:'female',phone: '166629816182',email: null } );
                        done();
                    });
            });
            after(function (done) {
                chai.request(server)
                    .get('/users/5bdde8b12f4b334e88f8d29f/profile')
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(1);
                        let result = _.map(res.body, (user) => {
                            return { gender: user.profile.gender,
                                      phone: user.profile.phone,
                                      email: user.profile.email }
                        });
                        expect(result).to.include({gender: 'female', phone: '166629816182', email: null});
                        done();
                    });
            });  // end-after


        });
        describe('when id is invalid',function() {
            it('should return a 404 and a message for invalid user id', function (done) {
                chai.request(server)
                    .put('/users/1100001/addProfile')
                    .end(function (err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('message', 'User NOT Found!');
                        done();
                    });
            });
        });

    });





    describe('DELETE /users/:username', () => {
            it('should return a confirmation message and update database ', function(done) {
                chai.request(server)
                    .delete('/users/Amber')
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
                            return { username: user.username,
                                      password: user.password };
                        }  );
                        //expect(result).to.have.lengthOf(1) ;
                        //expect(result).to.not.include( { paymenttype: 'Paypal', amount: 1600  } );
                        expect(result).to.not.include( { username: 'Amber', password: '19293484857'  } );
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
                    expect(res.body.length).to.equal(6);
                    let result = _.map(res.body, (user) => {
                        return { username: user.username,
                                  password: user.password }
                    });
                    expect(result).to.include( { username: "gullveig", password: 'qwert1997'  } );
                    expect(result).to.include( { username: "charlotte", password: 'qwert19970506' } );
                    expect(result).to.include( { username: "April", password: 'does1997'  } );
                    expect(result).to.include( { username: "diana", password: 'does19970506'  } );
                    expect(result).to.include( { username: "Daniel", password: '19970506'  } );
                    expect(result).to.include( { username: "Amber", password: '19293484857'  } );
                    //expect(result).to.include( { username: "zoe", password: 'zoe0914'  } );
                    done();
                });

        });
    });




    describe('GET /users/:username/info',  () => {
        it('should return a specific user matching the username in an array', function(done) {
            chai.request(server)
                .get('/users/gullveig/info')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (user) => {
                        return { username: user.username,
                                  gender: user.profile.gender, }
                    });
                    expect(result).to.include( { username: "gullveig", gender: 'female'  } );
                    //expect(result).to.include( { username: "charlotte", password: 'szmmhfsbl1997' } );
                    //expect(result).to.include( { username: "April", password: 'does19970506'  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });
        });
        it('should return a message for username that does not exist', function(done) {
            chai.request(server)
                .get('/users/1100001/info')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('Message','Sorry! Cannot find the user of this username!' ) ;
                    done();
                });
        });

    });





    describe('GET /users/:id/profile',  () => {
        it('should return profile info of a user in an array', function(done) {
            chai.request(server)
                .get('/users/5bda48a9467b3521a4b4a3b5/profile')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (user) => {
                        return { username:user.username,
                                  gender: user.profile.gender,
                                  email: user.profile.email }
                    });
                    expect(result).to.include( { username: 'gullveig', gender: 'female',email:'1804094745@qq.com'  } );
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });

        });
        it('should return a 404 and a message for invalid user id', function(done) {
            chai.request(server)
                .get('/users/1100001/profile')
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('message','User NOT Found!' ) ;
                    done();
                });
        });

    });





    describe('GET /users/specificex/:username',  () => {
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


});
