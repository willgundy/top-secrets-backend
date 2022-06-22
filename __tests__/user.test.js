const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const userData = {
  firstName: 'Test',
  lastName: 'Data',
  email: 'test@data.com',
  password: '12345',
};

describe('user routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('creates a new user', async () => {
    const res = await request(app).post('/users').send(userData);
    expect(res.status).toBe(200);
    const { firstName, lastName, email } = userData;

    expect(res.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
    });
  });
  afterAll(() => {
    pool.end();
  });
});
