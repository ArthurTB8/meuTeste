import { expect } from 'chai';
import request from 'supertest';
import { app } from '../index'; // Certifique-se de exportar o app no seu index.ts

describe('Measure Controller', () => {
it('should return 200 for successful upload', async () => {
const response = await request(app)
.post('/api/measures/upload')
.send({
image: 'base64image',
customer_code: 'customer1',
measure_datetime: new Date().toISOString(),
measure_type: 'WATER'
});
expect(response.status).to.equal(200);
});

// Adicione mais testes conforme necessário
});
