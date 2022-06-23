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
  await agent.post('/users/sessions').send({ email, password });
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
    console.log(agent);
    const loggedInUser = await agent.get('/users/me');

    console.log(loggedInUser.body);

    expect(loggedInUser.body).toEqual({
      ...user,
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });

  it('return error if user is not logged in', async () => {
    const res = await request(app).get('/users');

    expect(res.body).toEqual({
      message: 'You must be signed in to continue',
      status: 401,
    });
  });

  afterAll(() => {
    pool.end();
  });
});
