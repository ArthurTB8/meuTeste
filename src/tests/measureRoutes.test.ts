import request from 'supertest';
import { app } from '../index';
import { Measure } from '../models/measureModel';
import mongoose from 'mongoose';

describe('Measure Routes', () => {
beforeAll(async () => {
// Conectar ao banco de dados de teste
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test-db');
  });

afterAll(async () => {
// Desconectar do banco de dados de teste
    await mongoose.connection.close();
});

beforeEach(async () => {
// Limpar a coleção de medidas antes de cada teste
    await Measure.deleteMany({});
});

describe('POST /api/upload', () => {
it('deve fazer upload de uma imagem e retornar os dados da medição', async () => {
const response = await request(app)
.post('/api/upload')
.send({
image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==',
customer_code: 'CUST001',
measure_datetime: new Date().toISOString(),
measure_type: 'WATER'
});

expect(response.status).toBe(200);
expect(response.body).toHaveProperty('image_url');
expect(response.body).toHaveProperty('measure_value');
expect(response.body).toHaveProperty('measure_uuid');
});

it('deve retornar erro 400 para dados inválidos', async () => {
const response = await request(app)
.post('/api/upload')
.send({
image: 'invalid-base64',
customer_code: 'CUST001',
measure_datetime: new Date().toISOString(),
measure_type: 'INVALID'
});

expect(response.status).toBe(400);
expect(response.body).toHaveProperty('error_code', 'INVALID_DATA');
});

it('deve retornar erro 409 para leitura duplicada', async () => {
// Primeiro, criar uma medição
      await request(app)
.post('/api/upload')
.send({
image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==',
customer_code: 'CUST001',
measure_datetime: new Date().toISOString(),
measure_type: 'WATER'
});

// Tentar criar a mesma medição novamente
      const response = await request(app)
.post('/api/upload')
.send({
image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==',
customer_code: 'CUST001',
measure_datetime: new Date().toISOString(),
measure_type: 'WATER'
});

expect(response.status).toBe(409);
expect(response.body).toHaveProperty('error_code', 'DOUBLE_REPORT');
});
});

describe('GET /api/measures', () => {
it('deve retornar uma lista vazia quando não há medições', async () => {
const response = await request(app).get('/api/measures');

expect(response.status).toBe(200);
expect(response.body).toEqual([]);
});

it('deve retornar uma lista de medições quando existem registros', async () => {
// Criar algumas medições de teste
      await Measure.create([
{ customer_code: 'CUST001', measure_type: 'WATER', measure_datetime: new Date(), measure_value: 100, image_url: 'http://example.com/image1.jpg', measure_uuid: 'uuid1' },
        { customer_code: 'CUST002', measure_type: 'GAS', measure_datetime: new Date(), measure_value: 200, image_url: 'http://example.com/image2.jpg', measure_uuid: 'uuid2' }
      ]);

const response = await request(app).get('/api/measures');

expect(response.status).toBe(200);
expect(response.body.length).toBe(2);
expect(response.body[0]).toHaveProperty('customer_code', 'CUST001');
expect(response.body[1]).toHaveProperty('customer_code', 'CUST002');
});
});

describe('PUT /api/measures/:id', () => {
it('deve atualizar uma medição existente', async () => {
// Criar uma medição de teste
      const measure = await Measure.create({
customer_code: 'CUST001',
measure_type: 'WATER',
measure_datetime: new Date(),
measure_value: 100,
image_url: 'http://example.com/image1.jpg',
        measure_uuid: 'uuid1'
});

const response = await request(app)
.put(`/api/measures/${measure._id}`)
.send({ measure_value: 150 });

expect(response.status).toBe(200);
expect(response.body).toHaveProperty('measure_value', 150);
});

it('deve retornar erro 404 para medição não encontrada', async () => {
const fakeId = new mongoose.Types.ObjectId();
const response = await request(app)
.put(`/api/measures/${fakeId}`)
.send({ measure_value: 150 });

expect(response.status).toBe(404);
expect(response.body).toHaveProperty('error', 'Medição não encontrada');
});
});
});