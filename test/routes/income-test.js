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
});
