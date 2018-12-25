const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('./../../app');
const verifyToken = require('./../../middleware/verify-token');

chai.use(chaiHttp);
let token;
/*
describe('/api/geriatrics tests',()=>{
    before((done) => {
        chai.request(server)
            .post('/authenticate')
            .send({email:'omerrecepk@gmail.com',password:'123456'})
            .end((err,res)=>{
                token = res.body.token;
                done();
            })
    });

});
*/
