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

});
