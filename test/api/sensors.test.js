const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('./../../app');
const verifyToken = require('./../../middleware/verify-token');

chai.use(chaiHttp);
let token;

describe('/api/sensors test lists',()=>{
    before((done) => {
        chai.request(server)
            .post('/authenticate')
            .send({email:'omerrecepk@gmail.com',password:'123456'})
            .end((err,res)=>{
                token = res.body.token;
                done();
            })
    });

    describe('GET Verb Test Lists',() => {
        it('it should return today stimulus',(done) => {
            chai.request(server)
                .get('/api/sensor/get/stimulus/today?token='+token)
                .end((err,res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should return last stimulus',(done) => {
            chai.request(server)
                .get('/api/sensor/get/stimulus/last?token='+token)
                .end((err,res) => {
                    res.should.have.status(200);
                    done();
                });
        });

    });

});