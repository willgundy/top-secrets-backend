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

  it('should get secrets list if user is authorized', async () => {
    const [agent, user] = await registerAndLogin();
    const loggedInUser = await agent.get('/api/v1/users/me');

    const resp = await request(app).get('/api/v1/secrets');
    expect(resp.status).toBe(200);
    expect(resp.body.length).toEqual(2);
    });
  });

  afterAll(() => {
    pool.end();
  });
});
