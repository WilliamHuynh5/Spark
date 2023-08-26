import app from '../src/app';
import util from 'util';
import request from 'supertest';
import { emptyDir } from 'fs-extra';

beforeEach(async () => {
  await request(app).delete('/clear');
});

afterEach(async () => {
  await emptyDir('cals');
});

describe('/society/apply', () => {
  test('Apply to a society Test', async () => {
    const user = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid11@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5525155',
      })
      .expect(200);
    expect(user.body).toMatchObject({ token: expect.any(String) });

    // Attempt to create an application with an invalid token:
    await request(app)
      .post('/society/apply')
      .send({
        token: 'invalidtoken',
        societyName: 'Valid Society Name 123',
        description: 'Valid Society Description !23424!!??!?!',
      })
      .expect(401);

    const appli = await request(app).post('/society/apply').send({
      token: user.body.token,
      societyName: 'Valid Society Name 123',
      description: 'Valid Society Description !23424!!??!?!',
    });
    expect(appli.statusCode).toBe(200);
    expect(appli.body).toMatchObject({ applicationId: expect.any(Number) });
  });
});

describe('/society/join', () => {
  test('Join to a society Test', async () => {
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

    const application = await request(app)
      .post('/society/apply')
      .send({
        token: user1.body.token,
        societyName: 'Valid Society Name 123',
        description: 'Valid Society Description !23424!!??!?!',
      })
      .expect(200);

    const approved = await request(app)
      .put('/admin/application/approve')
      .send({
        token: user1.body.token,
        applicationId: application.body.applicationId,
      })
      .expect(200);

    const user2 = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid21@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555255',
      })
      .expect(200);

    // Attempt to join with an invalid token
    await request(app)
      .post('/society/join')
      .send({
        token: 'invalidtoken',
        societyId: approved.body.societyId,
      })
      .expect(401);

    // Attempt to join a society that doesn't exist
    await request(app)
      .post('/society/join')
      .send({
        token: user2.body.token,
        societyId: 999999,
      })
      .expect(400);

    await request(app)
      .post('/society/join')
      .send({
        token: user2.body.token,
        societyId: approved.body.societyId,
      })
      .expect(200);

    // Join the society a second time (no error)
    await request(app)
      .post('/society/join')
      .send({
        token: user2.body.token,
        societyId: approved.body.societyId,
      })
      .expect(200);
  });
});

describe('/society/view', () => {
  test('View a created society', async () => {
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

    const societyName = 'Valid Soc';
    const description = 'This is our description';
    const application = await request(app)
      .post('/society/apply')
      .send({
        token: user.body.token,
        societyName,
        description,
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

    const view = await request(app)
      .get('/society/view')
      .query({
        societyId: approved.body.societyId,
      })
      .expect(200);

    expect(view.body).toMatchObject({
      societyId: approved.body.societyId,
      societyName,
      description,
      photoURL: expect.any(String),
    });
  });
});

describe('/society/edit', () => {
  test('Edit a created society', async () => {
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

    let societyName = 'Valid Soc';
    let description = 'This is our description';
    const application = await request(app)
      .post('/society/apply')
      .send({
        token: user.body.token,
        societyName,
        description,
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

    societyName = 'New Soc Name';
    description = 'New valid description!!';

    const edit = await request(app)
      .put('/society/edit')
      .send({
        token: user.body.token,
        societyId: approved.body.societyId,
        societyName,
        description,
      })
      .expect(200);

    expect(edit.body).toMatchObject({});

    const view = await request(app)
      .get('/society/view')
      .query({
        societyId: approved.body.societyId,
      })
      .expect(200);

    expect(view.body).toMatchObject({
      societyId: approved.body.societyId,
      societyName,
      description,
      photoURL: expect.any(String),
    });
  });

  test('Success: non site admin, soc admin', async () => {
    // register admin
    const admin = await request(app)
      .post('/auth/register')
      .send({
        email: 'admin@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555555',
      })
      .expect(200);

    // register user
    const user = await request(app)
      .post('/auth/register')
      .send({
        email: 'user@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555551',
      })
      .expect(200);

    const societyName = 'New Soc Name';
    const description = 'New valid description!!';
    expect(admin.body.token).not.toEqual(user.body.token);
    const application = await request(app)
      .post('/society/apply')
      .send({
        token: user.body.token,
        societyName,
        description,
      })
      .expect(200);

    const approved = await request(app)
      .put('/admin/application/approve')
      .send({
        token: admin.body.token,
        applicationId: application.body.applicationId,
      })
      .expect(200);
    expect(approved.body.societyId).toEqual(expect.any(Number));

    // Non-site admin can edit
    const soc_admin = await request(app)
      .put('/society/edit')
      .send({
        token: user.body.token,
        societyId: approved.body.societyId,
        societyName,
        description: '',
      })
      .expect(200);

    expect(soc_admin.body).toMatchObject({});
  });

  test('Error checking', async () => {
    const admin = await request(app)
      .post('/auth/register')
      .send({
        email: 'admin@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555555',
      })
      .expect(200);

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

    const societyName = 'Valid Soc';
    const description = 'This is our description';
    const application = await request(app)
      .post('/society/apply')
      .send({
        token: admin.body.token,
        societyName,
        description,
      })
      .expect(200);

    const approved = await request(app)
      .put('/admin/application/approve')
      .send({
        token: admin.body.token,
        applicationId: application.body.applicationId,
      })
      .expect(200);
    expect(approved.body.societyId).toEqual(expect.any(Number));

    const failSocietyName = 'New Soc Name';
    const failDescription = 'New valid description!!';

    const edit = await request(app)
      .put('/society/edit')
      .send({
        token: user.body.token,
        societyId: approved.body.societyId,
        failSocietyName,
        failDescription,
      })
      .expect(403);

    expect(edit.body).toMatchObject({});

    // Name too short
    await request(app)
      .put('/society/edit')
      .send({
        token: admin.body.token,
        societyId: approved.body.societyId,
        societyName: '',
        failDescription,
      })
      .expect(400);

    // Create an invalid description
    let longDescription = '';
    for (let i = 0; i < 61; i++) {
      longDescription += '1234567890';
    }

    const view = await request(app)
      .get('/society/view')
      .query({
        societyId: approved.body.societyId,
      })
      .expect(200);

    expect(view.body).toMatchObject({
      societyId: approved.body.societyId,
      societyName,
      description,
      photoURL: expect.any(String),
    });
  });

  test('Invalid Session', async () => {
    const failSocietyName = 'New Soc Name';
    const failDescription = 'New valid description!!';

    await request(app)
      .put('/society/edit')
      .send({
        token: 'user.body.token',
        societyId: 1,
        failSocietyName,
        failDescription,
      })
      .expect(401);
  });

  test('Nonexistent Soc', async () => {
    const admin = await request(app)
      .post('/auth/register')
      .send({
        email: 'admin@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555555',
      })
      .expect(200);

    const failSocietyName = 'New Soc Name';
    const failDescription = 'New valid description!!';

    const edit = await request(app)
      .put('/society/edit')
      .send({
        token: admin.body.token,
        societyId: 1,
        failSocietyName,
        failDescription,
      })
      .expect(400);

    expect(edit.body).toMatchObject({});

    await request(app)
      .get('/society/view')
      .query({
        societyId: 1,
      })
      .expect(400);
  });

  test('Fail: Non-Member and Member edit attempt', async () => {
    const admin = await request(app)
      .post('/auth/register')
      .send({
        email: 'admin@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555555',
      })
      .expect(200);

    const societyName = 'New Soc Name';
    const description = 'New valid description!!';

    const application = await request(app)
      .post('/society/apply')
      .send({
        token: admin.body.token,
        societyName,
        description,
      })
      .expect(200);

    const approved = await request(app)
      .put('/admin/application/approve')
      .send({
        token: admin.body.token,
        applicationId: application.body.applicationId,
      })
      .expect(200);
    expect(approved.body.societyId).toEqual(expect.any(Number));

    const user = await request(app)
      .post('/auth/register')
      .send({
        email: 'user@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555551',
      })
      .expect(200);

    // Member fails to edit
    const non_member = await request(app)
      .put('/society/edit')
      .send({
        token: user.body.token,
        societyId: approved.body.societyId,
        societyName: 'valid',
        description: 'valid',
      })
      .expect(403);

    expect(non_member.body).toMatchObject({});

    await request(app)
      .post('/society/join')
      .send({
        token: user.body.token,
        societyId: approved.body.societyId,
      })
      .expect(200);

    // Member fails to edit
    const member = await request(app)
      .put('/society/edit')
      .send({
        token: user.body.token,
        societyId: approved.body.societyId,
        societyName: 'valid',
        description: 'valid',
      })
      .expect(403);

    expect(member.body).toMatchObject({});
  });
});

describe('/society/list', () => {
  it('List 2 socs', async () => {
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

    const name1: string = 'society1';
    const desc1: string = 'description12';

    const application = await request(app)
      .post('/society/apply')
      .send({
        token: user1.body.token,
        societyName: name1,
        description: desc1,
      })
      .expect(200);

    const name2 = 'society2';
    const desc2 = 'description12';

    const application2 = await request(app)
      .post('/society/apply')
      .send({
        token: user1.body.token,
        societyName: name2,
        description: desc2,
      })
      .expect(200);

    const name3 = 'society3';
    const desc3 = 'description21';

    const application3 = await request(app)
      .post('/society/apply')
      .send({
        token: user1.body.token,
        societyName: name3,
        description: desc3,
      })
      .expect(200);

    const approved1 = await request(app)
      .put('/admin/application/approve')
      .send({
        token: user1.body.token,
        applicationId: application.body.applicationId,
      })
      .expect(200);

    const approved2 = await request(app)
      .put('/admin/application/approve')
      .send({
        token: user1.body.token,
        applicationId: application2.body.applicationId,
      })
      .expect(200);

    const approved3 = await request(app)
      .put('/admin/application/approve')
      .send({
        token: user1.body.token,
        applicationId: application3.body.applicationId,
      })
      .expect(200);

    let list = await request(app).get('/society/list').expect(200);

    expect(list.body).toMatchObject({
      societies: [
        {
          societyId: approved1.body.societyId,
          societyName: name1,
          description: desc1,
        },
        {
          societyId: approved2.body.societyId,
          societyName: name2,
          description: desc2,
        },
        {
          societyId: approved3.body.societyId,
          societyName: name3,
          description: desc3,
        },
      ],
    });

    list = await request(app)
      .get('/society/list')
      .query({ searchString: 'description1' })
      .expect(200);

    expect(list.body).toMatchObject({
      societies: [
        {
          societyId: approved1.body.societyId,
          societyName: name1,
          description: desc1,
        },
        {
          societyId: approved2.body.societyId,
          societyName: name2,
          description: desc2,
        },
      ],
    });

    list = await request(app)
      .get('/society/list')
      .query({ paginationStart: 1, paginationEnd: 2 })
      .expect(200);

    expect(list.body).toMatchObject({
      societies: [
        {
          societyId: approved2.body.societyId,
          societyName: name2,
          description: desc2,
        },
      ],
    });
  });
});

describe('/society/members', () => {
  test('Testing societyMembers', async () => {
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

    const application = await request(app)
      .post('/society/apply')
      .send({
        token: user1.body.token,
        societyName: 'Valid Society Name',
        description: 'Valid Society Description !23424!!??!?!',
      })
      .expect(200);

    const approved = await request(app)
      .put('/admin/application/approve')
      .send({
        token: user1.body.token,
        applicationId: application.body.applicationId,
      })
      .expect(200);

    const members = await request(app)
      .get('/society/members')
      .query({
        societyId: approved.body.societyId,
      })
      .expect(200);
    const member_obj = {
      userId: expect.any(Number),
      zId: expect.any(String),
      nameFirst: expect.any(String),
      nameLast: expect.any(String),
      role: expect.any(String),
    };

    expect(members.body).toMatchObject({ members: [member_obj] });
  });
});

describe('/society', () => {
  test('Delete a society', async () => {
    // Create a society
    const admin = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid11@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5525155',
      })
      .expect(200);
    expect(admin.body).toMatchObject({ token: expect.any(String) });

    const application = await request(app)
      .post('/society/apply')
      .send({
        token: admin.body.token,
        societyName: 'Valid Society Name 123',
        description: 'Valid Society Description !23424!!??!?!',
      })
      .expect(200);
    expect(application.body).toMatchObject({
      applicationId: expect.any(Number),
    });

    const approved = await request(app)
      .put('/admin/application/approve')
      .send({
        token: admin.body.token,
        applicationId: application.body.applicationId,
      })
      .expect(200);

    let list = await request(app).get('/society/list').expect(200);

    const soc_obj = {
      societyId: expect.any(Number),
      societyName: expect.any(String),
      description: expect.any(String),
      photoURL: expect.any(String),
    };

    expect(list.body).toMatchObject({ societies: [soc_obj] });

    // Create a non siteAdmin user
    const user = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid21321@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5125455',
      })
      .expect(200);
    expect(user.body).toMatchObject({ token: expect.any(String) });

    // Attempt to delete a society that doesn't exist
    await request(app)
      .delete('/society')
      .query({
        token: admin.body.token,
        societyId: 9999999,
      })
      .expect(400);

    // Attempt to delete a society without permissions
    await request(app)
      .delete('/society')
      .query({
        token: user.body.token,
        societyId: approved.body.societyId,
      })
      .expect(403);

    // Delete the society
    await request(app)
      .delete('/society')
      .query({
        token: admin.body.token,
        societyId: approved.body.societyId,
      })
      .expect(200);

    list = await request(app).get('/society/list').expect(200);
    expect(list.body).toMatchObject({ societies: [] });
  });
});

describe('GET /society/events', () => {
  it('Basic Success', async () => {
    const admin = await request(app)
      .post('/auth/register')
      .send({
        email: 'admin@email.com',
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
        token: admin.body.token,
        applicationId: application.body.applicationId,
      })
      .expect(200);
    expect(approved.body.societyId).toEqual(expect.any(Number));

    const societyId = approved.body.societyId;

    const name1 = 'Event name1';
    const desc1 = 'Event desc1';
    const time1 = new Date(Date.now() + 100 * 60 * 60 * 1000);
    const location1 = 'West Pymble';

    // Create event1
    const event1 = await request(app)
      .post('/event')
      .send({
        token: admin.body.token,
        societyId,
        name: name1,
        description: desc1,
        time: time1,
        location: location1,
      })
      .expect(200);
    expect(event1.body).toMatchObject({ eventId: expect.any(Number) });

    const name2 = 'Event name2';
    const desc2 = 'Event desc2';
    const time2 = new Date(Date.now() + 100 * 60 * 60 * 1000);
    const location2 = 'Turramurra';

    // Create event2
    const event2 = await request(app)
      .post('/event')
      .send({
        token: admin.body.token,
        societyId,
        name: name2,
        description: desc2,
        time: time2,
        location: location2,
      })
      .expect(200);
    expect(event2.body).toMatchObject({ eventId: expect.any(Number) });

    const events = await request(app)
      .get('/society/events')
      .query({ societyId: societyId })
      .expect(200);

    expect(events.body).toMatchObject({
      events: [
        {
          eventId: event1.body.eventId,
          name: name1,
          description: desc1,
          time: util.format(time1),
          location: location1,
          societyId: societyId,
        },
        {
          eventId: event2.body.eventId,
          name: name2,
          description: desc2,
          time: util.format(time2),
          location: location2,
          societyId: societyId,
        },
      ],
    });
  });

  it('Only future events', async () => {
    const admin = await request(app)
      .post('/auth/register')
      .send({
        email: 'admin@email.com',
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
        token: admin.body.token,
        applicationId: application.body.applicationId,
      })
      .expect(200);
    expect(approved.body.societyId).toEqual(expect.any(Number));

    const societyId = approved.body.societyId;

    const name1 = 'Event name1';
    const desc1 = 'Event desc1';
    const time1 = new Date(Date.now() + 100 * 60 * 60 * 1000);
    const location1 = 'West Pymble';

    // Create event1
    const event1 = await request(app)
      .post('/event')
      .send({
        token: admin.body.token,
        societyId,
        name: name1,
        description: desc1,
        time: time1,
        location: location1,
      })
      .expect(200);
    expect(event1.body).toMatchObject({ eventId: expect.any(Number) });

    const name2 = 'Event name2';
    const desc2 = 'Event desc2';
    const time2 = new Date(Date.now() - 100 * 60 * 60 * 1000);
    const location2 = 'Turramurra';

    // Create event2 that is behind
    const event2 = await request(app)
      .post('/event')
      .send({
        token: admin.body.token,
        societyId,
        name: name2,
        description: desc2,
        time: time2,
        location: location2,
      })
      .expect(200);
    expect(event1.body).toMatchObject({ eventId: expect.any(Number) });

    const events = await request(app)
      .get('/society/events')
      .query({ societyId: societyId })
      .expect(200);

    expect(events.body).toMatchObject({
      events: [
        {
          eventId: event1.body.eventId,
          name: name1,
          description: desc1,
          time: util.format(time1),
          location: location1,
          societyId: societyId,
        },
      ],
    });
  });

  it('Nonexistent society', async () => {
    // Try to get a nonexistant society's events
    await request(app)
      .get('/society/events')
      .query({ societyId: 1032193291 })
      .expect(400);
  });
});
