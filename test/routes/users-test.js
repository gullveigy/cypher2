let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;

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

});
