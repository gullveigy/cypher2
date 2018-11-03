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
});
