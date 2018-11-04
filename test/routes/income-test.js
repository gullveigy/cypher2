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




});
