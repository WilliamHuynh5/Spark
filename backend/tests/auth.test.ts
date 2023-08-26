import app from '../src/app';
import request from 'supertest';
import { emptyDir } from 'fs-extra';

beforeEach(async () => {
  await request(app).delete('/clear');
});

afterEach(async () => {
  await emptyDir('cals');
});

describe('/auth/register', () => {
  test('Basic Register Test', async () => {
    const res = await request(app).post('/auth/register').send({
      email: 'valid@email.com',
      nameFirst: 'valid',
      nameLast: 'Name',
      password: 'Super valid password',
      zId: 'z5575555',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ token: expect.any(String) });
  });

  test('Dupe zId Test', async () => {
    const res1 = await request(app).post('/auth/register').send({
      email: 'valid@email.com',
      nameFirst: 'valid',
      nameLast: 'Name',
      password: 'Super valid password',
      zId: 'z5575555',
    });
    expect(res1.statusCode).toBe(200);

    const res2 = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid1@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5575555',
      })
      .expect(400);
    expect(res2.statusCode).toBe(400);
    expect(res2.body).toMatchObject({ error: 'Invalid zId' });
  });

  test('Dupe email Test', async () => {
    const res1 = await request(app).post('/auth/register').send({
      email: 'dupe@email.com',
      nameFirst: 'valid',
      nameLast: 'Name',
      password: 'Super valid password',
      zId: 'z5575555',
    });
    expect(res1.statusCode).toBe(200);

    const res2 = await request(app)
      .post('/auth/register')
      .send({
        email: 'dupe@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5575551',
      })
      .expect(400);
    expect(res2.statusCode).toBe(400);
    expect(res2.body).toMatchObject({ error: 'Invalid Email' });
  });

  test('Invalid email', async () => {
    // no @blah
    let res = await request(app)
      .post('/auth/register')
      .send({
        email: 'dupe',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5575551',
      })
      .expect(400);
    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({ error: 'Invalid Email' });

    // Too short
    res = await request(app)
      .post('/auth/register')
      .send({
        email: '',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5575551',
      })
      .expect(400);
    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({ error: 'Invalid Email' });
  });

  test('Invalid names', async () => {
    // no nameFirst
    let res = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid@email.com',
        nameFirst: '',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5575551',
      })
      .expect(400);
    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({ error: expect.any(String) });

    // no nameLast
    res = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid2@gmail.com',
        nameFirst: 'First',
        nameLast: '',
        password: 'Super valid password',
        zId: 'z5575552',
      })
      .expect(400);
    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({ error: expect.any(String) });
  });

  test('Invalid zId', async () => {
    // too short
    let res = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid@email.com',
        nameFirst: 'First',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z557',
      })
      .expect(400);
    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({ error: expect.any(String) });

    // too long
    res = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid1@email.com',
        nameFirst: 'First',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z55744444',
      })
      .expect(400);
    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({ error: expect.any(String) });
  });
});

describe('/auth/login', () => {
  test('Basic Login Test', async () => {
    // Register user
    const email = 'valid1@email.com';
    const password = 'Super valid password';
    const resReg = await request(app).post('/auth/register').send({
      email,
      nameFirst: 'valid',
      nameLast: 'Name',
      password,
      zId: 'z4559551',
    });
    expect(resReg.statusCode).toBe(200);
    expect(resReg.body).toMatchObject({ token: expect.any(String) });

    // Login User
    const resLog = await request(app).post('/auth/login').send({
      email,
      password,
    });
    expect(resLog.statusCode).toBe(200);
    expect(resLog.body).toMatchObject({ token: expect.any(String) });

    // Check that sessions are different
    expect(resLog.body.token).not.toEqual(resReg.body.token);
    // TODO: At some point check that the tokens can be used
  });

  test('Wrong password', async () => {
    // Register user
    const email = 'valid1@email.com';
    const password = 'Super valid password';
    const resReg = await request(app).post('/auth/register').send({
      email,
      nameFirst: 'valid',
      nameLast: 'Name',
      password,
      zId: 'z4559551',
    });
    expect(resReg.statusCode).toBe(200);
    expect(resReg.body).toMatchObject({ token: expect.any(String) });

    //  Fail to Login User
    const resLog = await request(app)
      .post('/auth/login')
      .send({
        email,
        password: password + 1,
      })
      .expect(400);
    expect(resLog.statusCode).toBe(400);
    expect(resLog.body).toMatchObject({ error: expect.any(String) });
    // TODO: At some point check that the tokens can be used
  });

  test('Wrong email', async () => {
    // Register user
    const email = 'valid1@email.com';
    const password = 'Super valid password';
    const resReg = await request(app).post('/auth/register').send({
      email,
      nameFirst: 'valid',
      nameLast: 'Name',
      password,
      zId: 'z4559551',
    });
    expect(resReg.statusCode).toBe(200);
    expect(resReg.body).toMatchObject({ token: expect.any(String) });

    //  Fail to Login User
    const resLog = await request(app)
      .post('/auth/login')
      .send({
        email: email + 1,
        password,
      })
      .expect(400);
    expect(resLog.statusCode).toBe(400);
    expect(resLog.body).toMatchObject({ error: expect.any(String) });
  });
});

describe('/auth/logout', () => {
  test('Basic Logout Test', async () => {
    // Register user
    const email = 'valid1@email.com';
    const password = 'Super valid password';
    const resReg = await request(app).post('/auth/register').send({
      email,
      nameFirst: 'valid',
      nameLast: 'Name',
      password,
      zId: 'z4559551',
    });
    expect(resReg.statusCode).toBe(200);
    expect(resReg.body).toMatchObject({ token: expect.any(String) });

    // Succeed in calling profile/view
    await request(app)
      .get('/profile/view')
      .query({
        token: resReg.body.token,
      })
      .expect(200);

    // Log out
    const logout = await request(app)
      .put('/auth/logout')
      .send({
        token: resReg.body.token,
      })
      .expect(200);

    expect(logout.body).toMatchObject({});
    // fail to use token
    const err = await request(app)
      .get('/profile/view')
      .query({
        token: resReg.body.token,
      })
      .expect(401);

    expect(err.body).toMatchObject({ error: 'Invalid token' });
  });
});

describe('/auth/reset', () => {
  test('Basic Reset Test', async () => {
    // Register user
    const email = 'valid1@email.com';
    const password = 'Super valid password';
    const resReg = await request(app).post('/auth/register').send({
      email,
      nameFirst: 'valid',
      nameLast: 'Name',
      password,
      zId: 'z4559551',
    });
    expect(resReg.statusCode).toBe(200);
    expect(resReg.body).toMatchObject({ token: expect.any(String) });

    // Invalid email
    await request(app)
      .get('/auth/reset')
      .query({ email: 'invalid' })
      .expect(400);

    await request(app)
      .post('/auth/reset')
      .send({ code: 'invalid', password: 'newpassword' })
      .expect(400);
  });
});
