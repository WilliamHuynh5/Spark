import app from '../src/app';
import request from 'supertest';
import util from 'util';
import { emptyDir } from 'fs-extra';

beforeEach(async () => {
  await request(app).delete('/clear');
});

afterEach(async () => {
  await emptyDir('cals');
});
describe('/profile/view', () => {
  it('Basic Success', async () => {
    const email = 'valid11@email.com';
    const nameFirst = 'valid';
    const nameLast = 'name';
    const zId = 'z5595155';
    const user = await request(app)
      .post('/auth/register')
      .send({
        email,
        nameFirst,
        nameLast,
        password: 'Super valid password',
        zId,
      })
      .expect(200);
    expect(user.body).toMatchObject({ token: expect.any(String) });

    const profile = await request(app)
      .get('/profile/view')
      .query({
        token: user.body.token,
      })
      .expect(200);
    expect(profile.body).toMatchObject({
      email: expect.any(String),
      nameFirst: expect.any(String),
      nameLast: expect.any(String),
      zId: expect.any(String),
      webcal: expect.any(String),
    });
  });

  it('Invalid Token Fail', async () => {
    const email = 'valid11@email.com';
    const nameFirst = 'valid';
    const nameLast = 'name';
    const zId = 'z5555155';
    const user = await request(app)
      .post('/auth/register')
      .send({
        email,
        nameFirst,
        nameLast,
        password: 'Super valid password',
        zId,
      })
      .expect(200);
    expect(user.body).toMatchObject({ token: expect.any(String) });

    const profile = await request(app)
      .get('/profile/view')
      .query({
        token: user.body.token + '1',
      })
      .expect(401);
  });
});

describe('/profile/edit', () => {
  it('Basic Success', async () => {
    const email = 'valid11@email.com';
    const nameFirst = 'valid';
    const nameLast = 'name';
    const zId = 'z5595155';
    const user = await request(app)
      .post('/auth/register')
      .send({
        email,
        nameFirst,
        nameLast,
        password: 'Super valid password',
        zId,
      })
      .expect(200);
    expect(user.body).toMatchObject({ token: expect.any(String) });

    const profile = await request(app)
      .get('/profile/view')
      .query({
        token: user.body.token,
      })
      .expect(200);
    expect(profile.body).toMatchObject({
      email,
      nameFirst,
      nameLast,
      zId,
      webcal: expect.any(String),
    });

    // Should succeed
    await request(app)
      .put('/profile/edit')
      .send({
        token: user.body.token,
        email: email,
        nameFirst: nameFirst,
        nameLast: nameLast,
      })
      .expect(200);

    const newEmail = 'new@email.com';
    const newFirst = 'New';
    const newLast = 'New';
    const edit = await request(app)
      .put('/profile/edit')
      .send({
        token: user.body.token,
        email: newEmail,
        nameFirst: newFirst,
        nameLast: newLast,
      })
      .expect(200);
    expect(edit.body).toMatchObject({
      email: newEmail,
      nameFirst: newFirst,
      nameLast: newLast,
      zId,
      webcal: expect.any(String),
    });
  });

  it('Invalid Token Fail', async () => {
    const email = 'valid11@email.com';
    const nameFirst = 'valid';
    const nameLast = 'Name';
    const zId = 'z5555155';
    const user = await request(app)
      .post('/auth/register')
      .send({
        email,
        nameFirst,
        nameLast,
        password: 'Super valid password',
        zId,
      })
      .expect(200);
    expect(user.body).toMatchObject({ token: expect.any(String) });

    const profile = await request(app)
      .put('/profile/edit')
      .send({
        token: user.body.token + '1',
      })
      .expect(401);
  });

  it('Invalid Email Fail', async () => {
    const email = 'valid11@email.com';
    const nameFirst = 'valid';
    const nameLast = 'name';
    const zId = 'z5555155';
    await request(app)
      .post('/auth/register')
      .send({
        email,
        nameFirst,
        nameLast,
        password: 'Super valid password',
        zId,
      })
      .expect(200);

    const user = await request(app)
      .post('/auth/register')
      .send({
        email: 'unique@email.com',
        nameFirst,
        nameLast,
        password: 'Super valid password',
        zId: 'z5363638',
      })
      .expect(200);
    expect(user.body).toMatchObject({ token: expect.any(String) });

    await request(app)
      .put('/profile/edit')
      .send({
        token: user.body.token,
        email,
        nameFirst,
        nameLast,
        password: 'Super valid password',
        zId,
      })
      .expect(400);
  });
});

describe('/profile/events', () => {
  it('Basic Success: No events', async () => {
    const email = 'valid11@email.com';
    const nameFirst = 'valid';
    const nameLast = 'name';
    const zId = 'z5595155';
    const user = await request(app)
      .post('/auth/register')
      .send({
        email,
        nameFirst,
        nameLast,
        password: 'Super valid password',
        zId,
      })
      .expect(200);
    expect(user.body).toMatchObject({ token: expect.any(String) });

    // No events
    let profile = await request(app)
      .get('/profile/events')
      .query({
        token: user.body.token,
      })
      .expect(200);
    expect(profile.body).toMatchObject({ attending: [], attended: [] });

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

    const time: Date = new Date(Date.now() + 100 * 60 * 60 * 1000);

    // create event
    const event = await request(app)
      .post('/event')
      .send({
        token: user.body.token,
        societyId: approved.body.societyId,
        name: 'Event name',
        description: 'event desc',
        time,
        location: 'ur mums house',
      })
      .expect(200);

    // Designate attending an event
    await request(app)
      .put('/event/attend')
      .send({ token: user.body.token, eventId: event.body.eventId })
      .expect(200);

    profile = await request(app)
      .get('/profile/events')
      .query({
        token: user.body.token,
      })
      .expect(200);

    expect(profile.body).toMatchObject({
      attending: [
        {
          name: 'Event name',
          eventId: event.body.eventId,
          description: 'event desc',
          time: util.format(time),
          location: 'ur mums house',
          societyId: approved.body.societyId,
        },
      ],
      attended: [],
    });

    // Attend the event
    await request(app)
      .post('/event/form')
      .send({
        eventId: event.body.eventId,
        email: email,
        nameFirst: nameFirst,
        nameLast: nameLast,
        zId: zId,
      })
      .expect(200);

    profile = await request(app)
      .get('/profile/events')
      .query({
        token: user.body.token,
      })
      .expect(200);

    expect(profile.body).toMatchObject({
      attending: [
        {
          name: 'Event name',
          eventId: event.body.eventId,
          description: 'event desc',
          time: util.format(time),
          location: 'ur mums house',
          societyId: approved.body.societyId,
        },
      ],
      attended: [
        {
          name: 'Event name',
          eventId: event.body.eventId,
          description: 'event desc',
          time: util.format(time),
          location: 'ur mums house',
          societyId: approved.body.societyId,
        },
      ],
    });
  });

  it('Invalid Token Fail', async () => {
    await request(app)
      .get('/profile/events')
      .query({
        token: '1',
      })
      .expect(401);
  });
});

describe('/profile/events', () => {
  it('Basic Success: No events', async () => {
    const email = 'valid11@email.com';
    const nameFirst = 'valid';
    const nameLast = 'name';
    const zId = 'z5595155';
    const user = await request(app)
      .post('/auth/register')
      .send({
        email,
        nameFirst,
        nameLast,
        password: 'Super valid password',
        zId,
      })
      .expect(200);
    expect(user.body).toMatchObject({ token: expect.any(String) });

    // No societies
    let profile = await request(app)
      .get('/profile/societies')
      .query({
        token: user.body.token,
      })
      .expect(200);
    expect(profile.body).toMatchObject({ societies: [] });

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

    // 1 society
    profile = await request(app)
      .get('/profile/societies')
      .query({
        token: user.body.token,
      })
      .expect(200);
    expect(profile.body).toMatchObject({
      societies: [
        {
          societyId: expect.any(Number),
          societyName: expect.any(String),
          description: expect.any(String),
          photoURL: expect.any(String),
        },
      ],
    });

    societyName = 'Valid Soc2';
    description = 'This is our description2';
    const app2 = await request(app)
      .post('/society/apply')
      .send({
        token: user.body.token,
        societyName,
        description,
      })
      .expect(200);

    const appr2 = await request(app)
      .put('/admin/application/approve')
      .send({
        token: user.body.token,
        applicationId: app2.body.applicationId,
      })
      .expect(200);
    expect(appr2.body.societyId).toEqual(expect.any(Number));

    // 2 societies
    profile = await request(app)
      .get('/profile/societies')
      .query({
        token: user.body.token,
      })
      .expect(200);

    const soc_obj = {
      societyId: expect.any(Number),
      societyName: expect.any(String),
      description: expect.any(String),
      photoURL: expect.any(String),
    };

    expect(profile.body).toMatchObject({
      societies: [soc_obj, soc_obj],
    });
  });

  it('Invalid Token Fail', async () => {
    await request(app)
      .get('/profile/societies')
      .query({
        token: '1',
      })
      .expect(401);
  });
});
