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

  it('should get the current user when logged in', async () => {
    const [agent, user] = await registerAndLogin();
    const loggedInUser = await agent.get('/api/v1/users/me');

    expect(loggedInUser.body).toEqual({
      ...user,
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });
  afterAll(() => {
    pool.end();
  });
});
