import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../index';

chai.use(chaiHttp);
const { expect } = chai;

describe('POST /upload', () => {
it('should successfully process a valid image', (done) => {
chai.request(app)
.post('/api/upload')
.send({
image: 'data:image/png;base64,...', // Substitua por uma imagem base64 válida
        customer_code: '12345',
measure_datetime: new Date().toISOString(),
measure_type: 'WATER',
})
.end((err, res) => {
if (err) return done(err);
expect(res).to.have.status(200);
expect(res.body).to.have.property('image_url');
expect(res.body).to.have.property('measure_value');
expect(res.body).to.have.property('measure_uuid');
done();
});
});

it('should return 400 for invalid data', (done) => {
chai.request(app)
.post('/api/upload')
.send({
image: 'invalid-base64',
customer_code: '12345',
measure_datetime: new Date().toISOString(),
measure_type: 'WATER',
})
.end((err, res) => {
if (err) return done(err);
expect(res).to.have.status(400);
expect(res.body).to.have.property('error_code', 'INVALID_DATA');
done();
});
});

it('should return 409 if reading already exists', (done) => {
// Mockar a leitura existente ou garantir que uma leitura com os mesmos parâmetros já está no banco
    chai.request(app)
.post('/api/upload')
.send({
image: 'data:image/png;base64,...',
customer_code: '12345',
measure_datetime: new Date().toISOString(),
measure_type: 'WATER',
})
.end((err, res) => {
if (err) return done(err);
expect(res).to.have.status(409);
expect(res.body).to.have.property('error_code', 'DOUBLE_REPORT');
done();
});
});
});
