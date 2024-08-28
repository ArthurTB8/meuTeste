import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../index'; // Ajuste o caminho conforme a estrutura do seu projeto

chai.use(chaiHttp);
const { expect } = chai;

describe('GET /images', () => {
it('should get all images', (done) => {
chai.request(app)
.get('/images')
.end((err, res) => {
if (err) return done(err);
expect(res).to.have.status(200);
expect(res.body).to.be.an('array');
done();
});
});
});
