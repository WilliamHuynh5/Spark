import app from '../src/app';
import request from 'supertest';

import { emptyDir } from 'fs-extra';

beforeEach(async () => {
  await request(app).delete('/clear');
});

afterEach(async () => {
  await emptyDir('cals');
});
describe('/admin/application/approve', () => {
  test('Create society Test', async () => {
    const user = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid11@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555155',
      })
      .expect(200);

    const application = await request(app)
      .post('/society/apply')
      .send({
        token: user.body.token,
        societyName: 'Valid Soc',
        description: 'This is our description',
      })
      .expect(200);

    const approved = await request(app)
      .put('/admin/application/approve')
      .send({
        token: user.body.token,
        applicationId: application.body.applicationId,
      })
      .expect(200);
    expect(approved.body.societyId).toEqual(expect.any(Number));
    // TODO: List the users of the society so we know the first user is an admin
  });
  // TODO: Error cases
  test('Non admin fail', async () => {
    const admin = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid11@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555155',
      })
      .expect(200);

    const user = await request(app)
      .post('/auth/register')
      .send({
        email: 'user@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555151',
      })
      .expect(200);

    const application = await request(app)
      .post('/society/apply')
      .send({
        token: admin.body.token,
        societyName: 'Valid Soc',
        description: 'This is our description',
      })
      .expect(200);

    const approved = await request(app)
      .put('/admin/application/approve')
      .send({
        token: user.body.token,
        applicationId: application.body.applicationId,
      })
      .expect(403);
  });
  test('Fail: non-existent appId', async () => {
    const user = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid11@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555155',
      })
      .expect(200);

    const application = await request(app)
      .post('/society/apply')
      .send({
        token: user.body.token,
        societyName: 'Valid Soc',
        description: 'This is our description',
      })
      .expect(200);

    const approved = await request(app)
      .put('/admin/application/approve')
      .send({
        token: user.body.token,
        applicationId: application.body.applicationId + 1,
      })
      .expect(400);
  });
});

describe('/admin/application/deny', () => {
  test('Deny Application Test', async () => {
    const user = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid11@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555155',
      })
      .expect(200);

    const application = await request(app)
      .post('/society/apply')
      .send({
        token: user.body.token,
        societyName: 'Valid Soc',
        description: 'This is our description',
      })
      .expect(200);

    const approved = await request(app)
      .put('/admin/application/deny')
      .send({
        token: user.body.token,
        applicationId: application.body.applicationId,
      })
      .expect(200);
    expect(approved.body).toEqual({});
    // TODO: List the applications to make sure it is denied
  });
  test('Non admin fail', async () => {
    const admin = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid11@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555155',
      })
      .expect(200);

    const user = await request(app)
      .post('/auth/register')
      .send({
        email: 'user@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555151',
      })
      .expect(200);

    const application = await request(app)
      .post('/society/apply')
      .send({
        token: admin.body.token,
        societyName: 'Valid Soc',
        description: 'This is our description',
      })
      .expect(200);

    await request(app)
      .put('/admin/application/deny')
      .send({
        token: user.body.token,
        applicationId: application.body.applicationId,
      })
      .expect(403);
  });
  test('Fail: non-existent appId', async () => {
    const user = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid11@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555155',
      })
      .expect(200);

    const application = await request(app)
      .post('/society/apply')
      .send({
        token: user.body.token,
        societyName: 'Valid Soc',
        description: 'This is our description',
      })
      .expect(200);

    const approved = await request(app)
      .put('/admin/application/deny')
      .send({
        token: user.body.token,
        applicationId: application.body.applicationId + 1,
      })
      .expect(400);
  });
});

describe('/admin/users', () => {
  test('Fetch 2 users', async () => {
    const admin = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid11@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555155',
      })
      .expect(200);
    await request(app)
      .post('/auth/register')
      .send({
        email: 'valid@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555555',
      })
      .expect(200);

    const list = await request(app)
      .get('/admin/users')
      .query({ token: admin.body.token })
      .expect(200);

    expect(list.body.users).toMatchObject([
      {
        id: expect.any(Number),
        email: expect.any(String),
        nameFirst: expect.any(String),
        nameLast: expect.any(String),
        zId: expect.any(String),
        isAdmin: expect.any(Boolean),
      },
      {
        id: expect.any(Number),
        email: expect.any(String),
        nameFirst: expect.any(String),
        nameLast: expect.any(String),
        zId: expect.any(String),
        isAdmin: expect.any(Boolean),
      },
    ]);
  });

  // Error cases
  test('Invalid Token', async () => {
    const user = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid11@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555155',
      })
      .expect(200);

    await request(app)
      .get('/admin/users')
      .query({ token: user.body.token + '1' })
      .expect(401);
  });
  test('User is not a site admin', async () => {
    const admin = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid11@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555155',
      })
      .expect(200);
    const user = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555555',
      })
      .expect(200);
    await request(app)
      .get('/admin/users')
      .query({ token: user.body.token })
      .expect(403);
  });
});

describe('/admin/application/list', () => {
  test('Create 3, approve 1, deny 1', async () => {
    const user = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid11@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555155',
      })
      .expect(200);

    const application = await request(app)
      .post('/society/apply')
      .send({
        token: user.body.token,
        societyName: 'Valid Soc',
        description: 'This is our description',
      })
      .expect(200);

    const approved = await request(app)
      .put('/admin/application/approve')
      .send({
        token: user.body.token,
        applicationId: application.body.applicationId,
      })
      .expect(200);

    const application2 = await request(app)
      .post('/society/apply')
      .send({
        token: user.body.token,
        societyName: 'Valid Soc2',
        description: 'This is our description',
      })
      .expect(200);

    const denied = await request(app)
      .put('/admin/application/deny')
      .send({
        token: user.body.token,
        applicationId: application2.body.applicationId,
      })
      .expect(200);

    // keep pending
    const application3 = await request(app)
      .post('/society/apply')
      .send({
        token: user.body.token,
        societyName: 'Valid Soc3',
        description: 'This is our description',
      })
      .expect(200);

    const list = await request(app)
      .get('/admin/application/list')
      .query({
        token: user.body.token,
      })
      .expect(200);

    const soc_obj = {
      applicationId: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      applicantId: expect.any(Number),
      status: expect.any(String),
    };
    expect(list.body.applications).toMatchObject([soc_obj, soc_obj, soc_obj]);
  });
  // TODO: Error cases
  test('Invalid token', async () => {
    await request(app)
      .get('/admin/application/list')
      .query({ token: 'eqewrqeqr' })
      .expect(401);
  });
  test('Not an admin', async () => {
    // admin
    await request(app)
      .post('/auth/register')
      .send({
        email: 'valid11@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555155',
      })
      .expect(200);

    // non admin
    const user = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555555',
      })
      .expect(200);
    await request(app)
      .get('/admin/application/list')
      .query({ token: user.body.token })
      .expect(403);
  });
});

describe('/admin/user/get', () => {
  test('Invalid zId', async () => {
    await request(app).get('/admin/user/get').query({ zId: 'z' }).expect(400);
  });
});

describe('/admin/user/remove', () => {
  test('Remove a user from the site', async () => {
    const admin = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid11@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555155',
      })
      .expect(200);

    const user = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555555',
      })
      .expect(200);

    const user_obj = {
      id: expect.any(Number),
      email: expect.any(String),
      nameFirst: expect.any(String),
      nameLast: expect.any(String),
      zId: expect.any(String),
      isAdmin: expect.any(Boolean),
    };

    const list1 = await request(app)
      .get('/admin/users')
      .query({ token: admin.body.token })
      .expect(200);

    expect(list1.body.users).toMatchObject([user_obj, user_obj]);

    // Get user by zid
    let userBody = await request(app)
      .get('/admin/user/get')
      .query({
        zId: 'z5555555',
      })
      .expect(200);

    // Attempt to delete a user that doesn't exist
    await request(app)
      .delete('/admin/user/remove')
      .query({
        token: admin.body.token,
        userId: 999999,
      })
      .expect(400);

    // Attempt to delete a user without being a siteAdmin
    await request(app)
      .delete('/admin/user/remove')
      .query({
        token: user.body.token,
        userId: userBody.body.id,
      })
      .expect(403);

    // As siteAdmin delete a user
    await request(app)
      .delete('/admin/user/remove')
      .query({
        token: admin.body.token,
        userId: userBody.body.id,
      })
      .expect(200);

    const list2 = await request(app)
      .get('/admin/users')
      .query({ token: admin.body.token })
      .expect(200);

    expect(list2.body.users).toMatchObject([user_obj]);
  });
});
