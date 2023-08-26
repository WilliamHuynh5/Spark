import app from '../src/app';
import request from 'supertest';
import { emptyDir } from 'fs-extra';

beforeEach(async () => {
  await request(app).delete('/clear');
});

afterEach(async () => {
  await emptyDir('cals');
});

describe('/perm/site/allocate', () => {
  test('Promote & Demote a User Test', async () => {
    // Register user1
    const email1 = 'perm1@email.com';
    const password1 = 'Super valid password';
    const resReg1 = await request(app).post('/auth/register').send({
      email: email1,
      nameFirst: 'valid',
      nameLast: 'Name',
      password: password1,
      zId: 'z1555551',
    });

    // Login User1
    const resLog1 = await request(app).post('/auth/login').send({
      email: email1,
      password: password1,
    });

    // Register user2
    const email2 = 'perm2@email.com';
    const password2 = 'Super valid password';
    const resReg2 = await request(app).post('/auth/register').send({
      email: email2,
      nameFirst: 'valid',
      nameLast: 'Name',
      password: password2,
      zId: 'z1555552',
    });

    // Get user2 by zid
    let user2 = await request(app).get('/admin/user/get').query({
      zId: 'z1555552',
    });
    expect(user2.body.isAdmin).toEqual(false);

    // Attempt to promote user2
    let permLevel = 1 as number;
    const token1 = resLog1.body.token as string;
    const userId2 = user2.body.id as number;
    const promote = await request(app).post('/perm/site/allocate').send({
      token: token1,
      userId: userId2,
      permLevel,
    });
    expect(promote.statusCode).toBe(200);

    // Check if user2 is now a siteAdmin
    user2 = await request(app).get('/admin/user/get').query({
      zId: 'z1555552',
    });
    expect(user2.body.isAdmin).toEqual(true);

    // Attempt to demote user2
    permLevel = 2;
    const demote = await request(app).post('/perm/site/allocate').send({
      token: token1,
      userId: userId2,
      permLevel,
    });
    expect(promote.statusCode).toBe(200);

    // Check if user2 is now a normal member
    user2 = await request(app).get('/admin/user/get').query({
      zId: 'z1555552',
    });
    expect(user2.body.isAdmin).toEqual(false);
  });
});

describe('/perm/site/allocate', () => {
  test('Site Permission Error Checker', async () => {
    // Attempt to promote with an invalid token
    await request(app)
      .post('/perm/site/allocate')
      .send({
        token: 'invalidid',
        userId: 9999999,
        permLevel: 2,
      })
      .expect(401);

    // Register user1
    const email1 = 'perm1@email.com';
    const password1 = 'Super valid password';
    const resReg1 = await request(app).post('/auth/register').send({
      email: email1,
      nameFirst: 'valid',
      nameLast: 'Name',
      password: password1,
      zId: 'z1555551',
    });

    // Login User1
    const resLog1 = await request(app).post('/auth/login').send({
      email: email1,
      password: password1,
    });

    // Register user2
    const resReg2 = await request(app).post('/auth/register').send({
      email: 'perm2@email.com',
      nameFirst: 'valid',
      nameLast: 'Name',
      password: 'Super valid password',
      zId: 'z1555552',
    });

    // Register user3
    const resReg3 = await request(app).post('/auth/register').send({
      email: 'perm3@email.com',
      nameFirst: 'valid',
      nameLast: 'Name',
      password: 'Super valid password',
      zId: 'z1555553',
    });

    // Get user2 by zid
    let user2 = await request(app).get('/admin/user/get').query({
      zId: 'z1555552',
    });
    expect(user2.body.isAdmin).toEqual(false);

    // Attempt to promote a non existing user
    await request(app)
      .post('/perm/site/allocate')
      .send({
        token: resLog1.body.token,
        userId: 999999,
        permLevel: 1,
      })
      .expect(400);

    // Attempt to promote user2 with an incorrect permLevel
    await request(app)
      .post('/perm/site/allocate')
      .send({
        token: resLog1.body.token,
        userId: user2.body.id,
        permLevel: 3,
      })
      .expect(400);

    // Attempt to promote user2 while not being a siteAdmin
    await request(app)
      .post('/perm/site/allocate')
      .send({
        token: resReg3.body.token,
        userId: user2.body.id,
        permLevel: 1,
      })
      .expect(403);
  });
});

describe('/perm/society/allocate', () => {
  test('Promote & Demote a SocietyMember Test', async () => {
    // Register user0
    const user0 = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid3212@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5254185',
      })
      .expect(200);

    // Register user1
    const user1 = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid11@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555155',
      })
      .expect(200);

    // User1 creates a society application
    const application = await request(app)
      .post('/society/apply')
      .send({
        token: user1.body.token,
        societyName: 'Valid Soc',
        description: 'This is our description',
      })
      .expect(200);

    // User0 approves the society creation and become admin
    const approved = await request(app)
      .put('/admin/application/approve')
      .send({
        token: user0.body.token,
        applicationId: application.body.applicationId,
      })
      .expect(200);

    // Register user2
    const user2 = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid22@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555255',
      })
      .expect(200);

    // User2 joins the society
    await request(app)
      .post('/society/join')
      .send({
        token: user2.body.token,
        societyId: approved.body.societyId,
      })
      .expect(200);

    // Check if user2 is now a normal member
    const user2View = await request(app).get('/admin/user/get').query({
      zId: 'z5555255',
    });

    const user2Id = user2View.body.id;

    // Promote User2 to a society moderator
    await request(app)
      .post('/perm/society/allocate')
      .send({
        token: user1.body.token,
        userId: user2Id,
        societyId: approved.body.societyId,
        permLevel: 2,
      })
      .expect(200);

    let view = await request(app)
      .get('/profile/view')
      .query({
        token: user2.body.token,
      })
      .expect(200);

    expect(view.body.adminSocieties.length).toBe(0);
    expect(view.body.modSocieties.length).toBe(1);

    // Promote User2 to a society admin
    await request(app)
      .post('/perm/society/allocate')
      .send({
        token: user1.body.token,
        userId: user2Id,
        societyId: approved.body.societyId,
        permLevel: 1,
      })
      .expect(200);

    view = await request(app)
      .get('/profile/view')
      .query({
        token: user2.body.token,
      })
      .expect(200);

    expect(view.body.adminSocieties.length).toBe(1);
    expect(view.body.modSocieties.length).toBe(0);

    // Demote User2 to a society member
    await request(app)
      .post('/perm/society/allocate')
      .send({
        token: user1.body.token,
        userId: user2Id,
        societyId: approved.body.societyId,
        permLevel: 3,
      })
      .expect(200);

    view = await request(app)
      .get('/profile/view')
      .query({
        token: user2.body.token,
      })
      .expect(200);

    expect(view.body.adminSocieties.length).toBe(0);
    expect(view.body.modSocieties.length).toBe(0);
  });
});

describe('/perm/society/allocate', () => {
  test('Society Permission Error Checker', async () => {
    // Attempt to promote with an invalid token
    await request(app)
      .post('/perm/society/allocate')
      .send({
        token: 'invalidid',
        userId: 999999,
        societyId: 99999999,
        permLevel: 2,
      })
      .expect(401);

    // Register user1
    const user1 = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid11@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555155',
      })
      .expect(200);

    // User1 creates a society application
    const application = await request(app)
      .post('/society/apply')
      .send({
        token: user1.body.token,
        societyName: 'Valid Soc',
        description: 'This is our description',
      })
      .expect(200);

    // User1 approves the society creation and become admin
    const approved = await request(app)
      .put('/admin/application/approve')
      .send({
        token: user1.body.token,
        applicationId: application.body.applicationId,
      })
      .expect(200);

    // Register user2
    const user2 = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid22@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555255',
      })
      .expect(200);

    // User2 joins the society
    await request(app)
      .post('/society/join')
      .send({
        token: user2.body.token,
        societyId: approved.body.societyId,
      })
      .expect(200);

    const user2View = await request(app).get('/admin/user/get').query({
      zId: 'z5555255',
    });

    const user2Id = user2View.body.id;

    // Register user3
    const user3 = await request(app)
      .post('/auth/register')
      .send({
        email: 'perm44@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5255455',
      })
      .expect(200);

    const user3View = await request(app).get('/admin/user/get').query({
      zId: 'z5255455',
    });
    const user3Id = user3View.body.id;

    // Attempt to promote a non existing user
    await request(app)
      .post('/perm/society/allocate')
      .send({
        token: user1.body.token,
        userId: 99999999,
        societyId: approved.body.societyId,
        permLevel: 2,
      })
      .expect(400);

    // Attempt to promote a user is a non existant society
    await request(app)
      .post('/perm/society/allocate')
      .send({
        token: user1.body.token,
        userId: user2Id,
        societyId: 99999999,
        permLevel: 2,
      })
      .expect(400);

    // Attempt to promote user3 who is not in the society
    await request(app)
      .post('/perm/society/allocate')
      .send({
        token: user1.body.token,
        userId: user3Id,
        societyId: approved.body.societyId,
        permLevel: 3,
      })
      .expect(400);

    // User3 attempt to promote user2 without being the society
    await request(app)
      .post('/perm/society/allocate')
      .send({
        token: user3.body.token,
        userId: user2Id,
        societyId: approved.body.societyId,
        permLevel: 3,
      })
      .expect(403);

    // Attempt to promote user2 with an incorrect permLevel
    await request(app)
      .post('/perm/society/allocate')
      .send({
        token: user1.body.token,
        userId: user2Id,
        societyId: approved.body.societyId,
        permLevel: 4,
      })
      .expect(400);

    // User3 joins the society
    await request(app)
      .post('/society/join')
      .send({
        token: user3.body.token,
        societyId: approved.body.societyId,
      })
      .expect(200);

    // Attempt to promote user2 to a permLevel higher than yourself
    await request(app)
      .post('/perm/society/allocate')
      .send({
        token: user3.body.token,
        userId: user2Id,
        societyId: approved.body.societyId,
        permLevel: 2,
      })
      .expect(403);

    // Promote user2
    await request(app)
      .post('/perm/society/allocate')
      .send({
        token: user1.body.token,
        userId: user2Id,
        societyId: approved.body.societyId,
        permLevel: 2,
      })
      .expect(200);

    // Attempt to demote user2 while being lower permLevel
    await request(app)
      .post('/perm/society/allocate')
      .send({
        token: user3.body.token,
        userId: user2Id,
        societyId: approved.body.societyId,
        permLevel: 3,
      })
      .expect(403);

    // User2 promotes user3
    await request(app)
      .post('/perm/society/allocate')
      .send({
        token: user2.body.token,
        userId: user3Id,
        societyId: approved.body.societyId,
        permLevel: 2,
      })
      .expect(200);
  });
});
