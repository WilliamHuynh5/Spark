import { echo } from '../src/echo';
import app from '../src/app';
import request from 'supertest';
import { emptyDir } from 'fs-extra';

beforeEach(async () => {
  await request(app).delete('/clear');
});

afterEach(async () => {
  await emptyDir('cals');
});

// Not a HTTP test
describe('Echo unit test', () => {
  it('Test 1', async () => {
    const res = await echo('Hello World!');
    expect(res).toBeInstanceOf(Object);
    expect(res).toHaveProperty('echo');
    expect(res).toMatchObject({ echo: expect.any(String) });
  });
});

describe('root HTTP unit test', () => {
  test('Test 1', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});

describe('Echo HTTP unit test', () => {
  test('Test 1', async () => {
    const res = await request(app).post('/echo').send('balls');
    expect(res.statusCode).toBe(200);
  });
});
