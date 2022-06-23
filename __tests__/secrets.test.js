const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const userData = {
  firstName: 'Test',
  lastName: 'Data',
  email: 'test@data.com',
  password: '12345',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? userData.password;

  const agent = request.agent(app);

  const user = await UserService.create({ ...userData, ...userProps });

  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('secret routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('should get secrets list if user is authorized', async () => {
    const [agent] = await registerAndLogin();

    const resp = await agent.get('/api/v1/secrets');
    expect(resp.status).toBe(200);
    expect(resp.body.length).toEqual(2);
  });

  it('should not allow unauthorized users to get secrets', async () => {
    const resp = await request(app).get('/api/v1/secrets');
    expect(resp.status).toBe(401);
    expect(resp.body).toEqual({ status: 401, message: 'You must be signed in to continue' });
  });

  it('should let authorized users add a secret', async () => {
    const [agent] = await registerAndLogin();

    const resp = await agent.post('/api/v1/secrets').send({ title: 'lizard people', description: 'you dont know the half of it'});
    expect(resp.status).toBe(200);
    const res = await agent.get('/api/v1/secrets');
    expect(res.body.length).toEqual(3);
  });

  it('should not let unauthorized users add a secret', async () => {
    const resp = await request(app).post('/api/v1/secrets').send({ title: 'lizard people', description: 'you dont know the half of it'});
    expect(resp.status).toBe(401);
    expect(resp.body).toEqual({ status: 401, message: 'You must be signed in to continue' });
  });

  afterAll(() => {
    pool.end();
  });
});
