import util from 'util';
import app from '../src/app';
import request from 'supertest';
import { emptyDir } from 'fs-extra';

beforeEach(async () => {
  await request(app).delete('/clear');
});

afterEach(async () => {
  await emptyDir('cals');
});

describe('POST /event', () => {
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
        token: admin.body.token,
        applicationId: application.body.applicationId,
      })
      .expect(200);
    expect(approved.body.societyId).toEqual(expect.any(Number));

    const time: Date = new Date(Date.now() + 100 * 60 * 60 * 1000);

    // create event
    const event2 = await request(app)
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

    expect(event2.body).toMatchObject({ eventId: expect.any(Number) });
  });

  it('Nonexistent token', async () => {
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

    // Fail to create event due to non existent token
    await request(app)
      .post('/event')
      .send({
        token: user.body.token + 1,
        societyId: approved.body.societyId,
        name: 'Event name',
        description: 'event desc',
        time: Date.now() / 1000 + 1000,
        location: 'ur mums house',
      })
      .expect(401);
  });

  it('inadequate perms', async () => {
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

    let societyName = 'Valid Soc';
    let description = 'This is our description';
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

    await request(app)
      .post('/society/join')
      .send({ token: user.body.token, societyId: approved.body.societyId })
      .expect(200);
    const time: Date = new Date(Date.now() + 100 * 60 * 60 * 1000);

    // Fail to create event due to invalid permissions (only a member of soc)
    await request(app)
      .post('/event')
      .send({
        token: user.body.token,
        societyId: approved.body.societyId,
        name: 'Event name',
        description: 'event desc',
        time,
        location: 'ur mums house',
      })
      .expect(403);
  });

  it('Nonexistent society', async () => {
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

    // Fail to create event due to non existent society
    await request(app)
      .post('/event')
      .send({
        token: user.body.token,
        societyId: 1,
        name: 'Event name',
        description: 'event desc',
        time: Date.now() / 1000 + 1000,
        location: 'ur mums house',
      })
      .expect(400);
  });
});

describe('GET /event', () => {
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
        token: admin.body.token,
        applicationId: application.body.applicationId,
      })
      .expect(200);
    expect(approved.body.societyId).toEqual(expect.any(Number));

    const name = 'Event name';
    description = 'event desc';
    const time: Date = new Date(Date.now() + 100 * 60 * 60 * 1000);
    const location = 'ur mums house';
    const societyId = approved.body.societyId;

    // Create event
    const event = await request(app)
      .post('/event')
      .send({
        token: user.body.token,
        societyId,
        name,
        description,
        time,
        location,
      })
      .expect(200);

    expect(event.body).toMatchObject({ eventId: expect.any(Number) });

    // Get event
    const get = await request(app)
      .get('/event')
      .query({ eventId: event.body.eventId })
      .expect(200);

    expect(get.body).toMatchObject({
      eventId: event.body.eventId,
      name,
      description,
      time: util.format(time),
      location,
      societyId,
    });
  });

  it('Nonexistent event', async () => {
    // Fail to create get event because it doesn't exist
    await request(app)
      .get('/event')
      .query({
        eventId: 1,
      })
      .expect(400);
  });
});

describe('DELETE /event', () => {
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
        token: admin.body.token,
        applicationId: application.body.applicationId,
      })
      .expect(200);
    expect(approved.body.societyId).toEqual(expect.any(Number));

    const name = 'Event name';
    description = 'event desc';
    const time = Date.now() / 1000 + 1000;
    const location = 'ur mums house';
    const societyId = approved.body.societyId;

    // create event
    const event = await request(app)
      .post('/event')
      .send({
        token: user.body.token,
        societyId,
        name,
        description,
        time,
        location,
      })
      .expect(200);

    expect(event.body).toMatchObject({ eventId: expect.any(Number) });

    const del = await request(app)
      .delete('/event')
      .query({ token: user.body.token, eventId: event.body.eventId })
      .expect(200);

    expect(del.body).toMatchObject({});
  });

  it('Error Checks', async () => {
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

    const user2 = await request(app)
      .post('/auth/register')
      .send({
        email: 'valid21@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5555355',
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
        token: admin.body.token,
        applicationId: application.body.applicationId,
      })
      .expect(200);
    expect(approved.body.societyId).toEqual(expect.any(Number));

    const name = 'Event name';
    description = 'event desc';
    const time = Date.now() / 1000 + 1000;
    const location = 'ur mums house';
    const societyId = approved.body.societyId;

    // Create event
    const event = await request(app)
      .post('/event')
      .send({
        token: user.body.token,
        societyId,
        name,
        description,
        time,
        location,
      })
      .expect(200);

    expect(event.body).toMatchObject({ eventId: expect.any(Number) });

    // Atempt to delete a non existing event
    await request(app)
      .delete('/event')
      .query({ token: user.body.token, eventId: event.body.eventId + 1 })
      .expect(400);

    // Attempt to delete a event while not being apart of the society
    await request(app)
      .delete('/event')
      .query({ token: user2.body.token, eventId: event.body.eventId })
      .expect(403);

    // Join the society
    await request(app)
      .post('/society/join')
      .send({
        token: user2.body.token,
        societyId: approved.body.societyId,
      })
      .expect(200);

    // Attempt to delete a event without proper permissions
    await request(app)
      .delete('/event')
      .query({ token: user2.body.token, eventId: event.body.eventId })
      .expect(403);
  });
});

describe('PUT /event/attend', () => {
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

    // Create event
    const event = await request(app)
      .post('/event')
      .send({
        token: admin.body.token,
        societyId: approved.body.societyId,
        name: 'Event name',
        description: 'event desc',
        time: Date.now() / 1000 + 1000,
        location: 'ur mums house',
      })
      .expect(200);

    expect(event.body).toMatchObject({ eventId: expect.any(Number) });

    // Designate attending for an event
    let attend = await request(app)
      .put('/event/attend')
      .send({ token: admin.body.token, eventId: event.body.eventId })
      .expect(200);

    expect(attend.body).toMatchObject({});

    // Attempt to attend it a second time
    attend = await request(app)
      .put('/event/attend')
      .send({ token: admin.body.token, eventId: event.body.eventId })
      .expect(200);

    expect(attend.body).toMatchObject({});
  });

  it('Nonexistent event', async () => {
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

    const attend = await request(app)
      .put('/event/attend')
      .send({ token: admin.body.token, eventId: 9939219321 })
      .expect(400);
  });
});

describe('GET /event/status', () => {
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

    // Create event
    const event = await request(app)
      .post('/event')
      .send({
        token: admin.body.token,
        societyId: approved.body.societyId,
        name: 'Event name',
        description: 'event desc',
        time: Date.now() / 1000 + 1000,
        location: 'ur mums house',
      })
      .expect(200);

    expect(event.body).toMatchObject({ eventId: expect.any(Number) });

    // Check your attending status is false
    const status1 = await request(app)
      .get('/event/status')
      .query({ token: admin.body.token, eventId: event.body.eventId })
      .expect(200);

    expect(status1.body).toMatchObject({ attending: false });

    // Attend an event
    let attend = await request(app)
      .put('/event/attend')
      .send({ token: admin.body.token, eventId: event.body.eventId })
      .expect(200);

    expect(attend.body).toMatchObject({});

    // Check your attending status is true
    const status2 = await request(app)
      .get('/event/status')
      .query({ token: admin.body.token, eventId: event.body.eventId })
      .expect(200);

    expect(status2.body).toMatchObject({ attending: true });
  });

  it('Nonexistent event', async () => {
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

    await request(app)
      .get('/event/status')
      .query({ token: admin.body.token, eventId: 9999999 })
      .expect(400);
  });
});

describe('DELETE /event/attend', () => {
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

    // Create event
    const event = await request(app)
      .post('/event')
      .send({
        token: admin.body.token,
        societyId: approved.body.societyId,
        name: 'Event name',
        description: 'event desc',
        time: Date.now() / 1000 + 1000,
        location: 'ur mums house',
      })
      .expect(200);

    expect(event.body).toMatchObject({ eventId: expect.any(Number) });

    // Attend an event
    let attend = await request(app)
      .put('/event/attend')
      .send({ token: admin.body.token, eventId: event.body.eventId })
      .expect(200);

    expect(attend.body).toMatchObject({});

    // Unattend the event
    attend = await request(app)
      .delete('/event/attend')
      .query({ token: admin.body.token, eventId: event.body.eventId })
      .expect(200);

    expect(attend.body).toMatchObject({});
  });

  it('Nonexistent event', async () => {
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

    // Create event
    const event = await request(app)
      .post('/event')
      .send({
        token: admin.body.token,
        societyId: approved.body.societyId,
        name: 'Event name',
        description: 'event desc',
        time: Date.now() / 1000 + 1000,
        location: 'ur mums house',
      })
      .expect(200);

    expect(event.body).toMatchObject({ eventId: expect.any(Number) });

    await request(app)
      .delete('/event/attend')
      .query({ token: admin.body.token, eventId: event.body.eventId + 1 })
      .expect(400);
  });

  it('Unattending before attending', async () => {
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

    // Create event
    const event = await request(app)
      .post('/event')
      .send({
        token: admin.body.token,
        societyId: approved.body.societyId,
        name: 'Event name',
        description: 'event desc',
        time: Date.now() / 1000 + 1000,
        location: 'ur mums house',
      })
      .expect(200);

    expect(event.body).toMatchObject({ eventId: expect.any(Number) });

    // Attempt to unattend the event
    await request(app)
      .delete('/event/attend')
      .query({ token: admin.body.token, eventId: event.body.eventId })
      .expect(400);
  });
});

describe('PUT /event/edit', () => {
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
        token: admin.body.token,
        applicationId: application.body.applicationId,
      })
      .expect(200);
    expect(approved.body.societyId).toEqual(expect.any(Number));

    const time: Date = new Date(Date.now() + 100 * 60 * 60 * 1000);

    // Create a event
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

    expect(event.body).toMatchObject({ eventId: expect.any(Number) });

    // Desiginate attending for an event
    let attend = await request(app)
      .put('/event/attend')
      .send({ token: admin.body.token, eventId: event.body.eventId })
      .expect(200);

    expect(attend.body).toMatchObject({});

    // Edit the event
    const new_name = 'new event name';
    const new_desc = 'new desc';
    const new_time = new Date(Date.now() + 100 * 60 * 60 * 1000);
    const new_loc = 'not my mums house';

    const edit = await request(app)
      .put('/event/edit')
      .send({
        token: user.body.token,
        eventId: event.body.eventId,
        name: new_name,
        description: new_desc,
        time: new_time,
        location: new_loc,
      })
      .expect(200);

    expect(edit.body).toMatchObject({});

    // Check the event has changed
    const get = await request(app)
      .get('/event')
      .query({ eventId: event.body.eventId })
      .expect(200);

    expect(get.body).toMatchObject({
      eventId: event.body.eventId,
      name: new_name,
      description: new_desc,
      location: new_loc,
      societyId: approved.body.societyId,
    });
  });

  it('Nonexistent token & eventId', async () => {
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

    // Create an event
    const event = await request(app)
      .post('/event')
      .send({
        token: user.body.token,
        societyId: approved.body.societyId,
        name: 'Event name',
        description: 'event desc',
        time: Date.now() / 1000 + 1000,
        location: 'ur mums house',
      })
      .expect(200);

    await request(app)
      .put('/event/edit')
      .send({
        token: user.body.token + 1,
        eventId: event.body.eventId,
        name: 'new name',
        description: 'new desc',
        time: Date.now() / 1000 + 1000,
        location: 'not my mums house',
      })
      .expect(401);

    await request(app)
      .put('/event/edit')
      .send({
        token: user.body.token,
        eventId: event.body.eventId + 1,
        name: 'new name',
        description: 'new desc',
        time: Date.now() / 1000 + 1000,
        location: 'not my mums house',
      })
      .expect(400);
  });

  it('inadequate perms', async () => {
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

    let societyName = 'Valid Soc';
    let description = 'This is our description';
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

    await request(app)
      .post('/society/join')
      .send({ token: user.body.token, societyId: approved.body.societyId })
      .expect(200);
    const time: Date = new Date(Date.now() + 100 * 60 * 60 * 1000);

    // Create an event
    const event = await request(app)
      .post('/event')
      .send({
        token: admin.body.token,
        societyId: approved.body.societyId,
        name: 'Event name',
        description: 'event desc',
        time,
        location: 'ur mums house',
      })
      .expect(200);

    // Fail to edit an event due to lacking permissions
    await request(app)
      .put('/event/edit')
      .send({
        token: user.body.token,
        eventId: event.body.eventId,
        name: 'new name',
        description: 'new desc',
        time: Date.now() / 1000 + 1000,
        location: 'not my mums house',
      })
      .expect(403);
  });
});

describe('GET /event/list', () => {
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
        token: admin.body.token,
        applicationId: application.body.applicationId,
      })
      .expect(200);
    expect(approved.body.societyId).toEqual(expect.any(Number));

    // Create multiple events event
    const name1: string = 'Event1';
    const desc1: string = 'desc11';
    const time1: Date = new Date(Date.now()); // + 100 * 60 * 60 * 1000
    const loc1: string = 'location1';

    const event1 = await request(app)
      .post('/event')
      .send({
        token: user.body.token,
        societyId: approved.body.societyId,
        name: name1,
        description: desc1,
        time: time1,
        location: loc1,
      })
      .expect(200);

    expect(event1.body).toMatchObject({ eventId: expect.any(Number) });

    const name2: string = 'Event2';
    const desc2: string = 'desc12';
    const time2: Date = new Date(Date.now()); // + 100 * 60 * 60 * 1000
    const loc2: string = 'location2';

    const event2 = await request(app)
      .post('/event')
      .send({
        token: user.body.token,
        societyId: approved.body.societyId,
        name: name2,
        description: desc2,
        time: time2,
        location: loc2,
      })
      .expect(200);

    expect(event2.body).toMatchObject({ eventId: expect.any(Number) });

    const name3: string = 'Event3';
    const desc3: string = 'desc3';
    const time3: Date = new Date(Date.now()); // + 100 * 60 * 60 * 1000
    const loc3: string = 'location3';

    const event3 = await request(app)
      .post('/event')
      .send({
        token: user.body.token,
        societyId: approved.body.societyId,
        name: name3,
        description: desc3,
        time: time3,
        location: loc3,
      })
      .expect(200);

    expect(event3.body).toMatchObject({ eventId: expect.any(Number) });

    // Get all those events
    let events = await request(app).get('/event/list').query({}).expect(200);

    expect(events.body).toMatchObject({
      events: [
        {
          eventId: event1.body.eventId,
          name: name1,
          description: desc1,
          location: loc1,
          societyId: approved.body.societyId,
        },
        {
          eventId: event2.body.eventId,
          name: name2,
          description: desc2,
          location: loc2,
          societyId: approved.body.societyId,
        },
        {
          eventId: event3.body.eventId,
          name: name3,
          description: desc3,
          location: loc3,
          societyId: approved.body.societyId,
        },
      ],
    });

    // Get events that match keyword
    events = await request(app)
      .get('/event/list')
      .query({ searchString: 'desc1' })
      .expect(200);

    expect(events.body).toMatchObject({
      events: [
        {
          eventId: event1.body.eventId,
          name: name1,
          description: desc1,
          location: loc1,
          societyId: approved.body.societyId,
        },
        {
          eventId: event2.body.eventId,
          name: name2,
          description: desc2,
          location: loc2,
          societyId: approved.body.societyId,
        },
      ],
    });

    // Get all events occur after a time
    events = await request(app)
      .get('/event/list')
      .query({ timeStart: time2 })
      .expect(200);

    expect(events.body).toMatchObject({
      events: [
        {
          eventId: event2.body.eventId,
          name: name2,
          description: desc2,
          location: loc2,
          societyId: approved.body.societyId,
        },
        {
          eventId: event3.body.eventId,
          name: name3,
          description: desc3,
          location: loc3,
          societyId: approved.body.societyId,
        },
      ],
    });

    // Get events that occur before a time
    events = await request(app)
      .get('/event/list')
      .query({ timeEnd: time2 })
      .expect(200);

    expect(events.body).toMatchObject({
      events: [
        {
          eventId: event1.body.eventId,
          name: name1,
          description: desc1,
          location: loc1,
          societyId: approved.body.societyId,
        },
        {
          eventId: event2.body.eventId,
          name: name2,
          description: desc2,
          location: loc2,
          societyId: approved.body.societyId,
        },
      ],
    });

    // Get the middle event
    events = await request(app)
      .get('/event/list')
      .query({ paginationStart: 1, paginationEnd: 2 })
      .expect(200);

    expect(events.body).toMatchObject({
      events: [
        {
          eventId: event2.body.eventId,
          name: name2,
          description: desc2,
          location: loc2,
          societyId: approved.body.societyId,
        },
      ],
    });
  });
});

describe('POST /event/form', () => {
  it('Simple Success', async () => {
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

    let societyName = 'Valid Soc';
    let description = 'This is our description';
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

    const time: Date = new Date(Date.now() + 100 * 60 * 60 * 1000);

    // create event
    const event2 = await request(app)
      .post('/event')
      .send({
        token: admin.body.token,
        societyId: approved.body.societyId,
        name: 'Event name',
        description: 'event desc',
        time,
        location: 'ur mums house',
      })
      .expect(200);

    expect(event2.body).toMatchObject({ eventId: expect.any(Number) });

    await request(app)
      .post('/event/form')
      .send({
        eventId: event2.body.eventId,
        email: 'admin@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        zId: 'z5555151',
      })
      .expect(200);
  });

  it('Not logged in', async () => {
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

    let societyName = 'Valid Soc';
    let description = 'This is our description';
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

    const time: Date = new Date(Date.now() + 100 * 60 * 60 * 1000);

    // create event
    const event2 = await request(app)
      .post('/event')
      .send({
        token: admin.body.token,
        societyId: approved.body.societyId,
        name: 'Event name',
        description: 'event desc',
        time,
        location: 'ur mums house',
      })
      .expect(200);

    expect(event2.body).toMatchObject({ eventId: expect.any(Number) });

    await request(app)
      .post('/event/form')
      .send({
        eventId: event2.body.eventId,
        email: 'newemail@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        zId: 'z5555101',
      })
      .expect(200);
  });

  it('Invalid email', async () => {
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

    let societyName = 'Valid Soc';
    let description = 'This is our description';
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

    const time: Date = new Date(Date.now() + 100 * 60 * 60 * 1000);

    // create event
    const event2 = await request(app)
      .post('/event')
      .send({
        token: admin.body.token,
        societyId: approved.body.societyId,
        name: 'Event name',
        description: 'event desc',
        time,
        location: 'ur mums house',
      })
      .expect(200);

    expect(event2.body).toMatchObject({ eventId: expect.any(Number) });

    await request(app)
      .post('/event/form')
      .send({
        eventId: event2.body.eventId,
        email: 'admin',
        nameFirst: 'valid',
        nameLast: 'Name',
        zId: 'z5555151',
      })
      .expect(400);
  });
});

describe('POST /event/generateCSV', () => {
  it('Simple Success', async () => {
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

    const user = await request(app)
      .post('/auth/register')
      .send({
        email: 'user@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        password: 'Super valid password',
        zId: 'z5152151',
      })
      .expect(200);

    let societyName = 'Valid Soc';
    let description = 'This is our description';
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

    const time: Date = new Date(Date.now() + 100 * 60 * 60 * 1000);

    // create event
    const event = await request(app)
      .post('/event')
      .send({
        token: admin.body.token,
        societyId: approved.body.societyId,
        name: 'Event name',
        description: 'event desc',
        time,
        location: 'ur mums house',
      })
      .expect(200);

    expect(event.body).toMatchObject({ eventId: expect.any(Number) });

    // Logged in user
    await request(app)
      .post('/event/form')
      .send({
        eventId: event.body.eventId,
        email: 'admin@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        zId: 'z5555151',
      })
      .expect(200);

    // Guest user
    await request(app)
      .post('/event/form')
      .send({
        eventId: event.body.eventId,
        email: 'guest@email.com',
        nameFirst: 'valid',
        nameLast: 'Name',
        zId: 'z5000000',
      })
      .expect(200);

    // Invalid generates
    await request(app)
      .post('/event/generateCSV')
      .send({
        token: admin.body.token,
        eventId: event.body.eventId + 1,
      })
      .expect(400);

    await request(app)
      .post('/event/generateCSV')
      .send({
        token: user.body.token,
        eventId: event.body.eventId,
      })
      .expect(403);

    await request(app)
      .post('/society/join')
      .send({ token: user.body.token, societyId: approved.body.societyId })
      .expect(200);

    await request(app)
      .post('/event/generateCSV')
      .send({
        token: user.body.token,
        eventId: event.body.eventId,
      })
      .expect(403);

    // Valid generate
    await request(app)
      .post('/event/generateCSV')
      .send({
        token: admin.body.token,
        eventId: event.body.eventId,
      })
      .expect(200);

    await request(app)
      .get(`/attendance/event-${event.body.eventId}.csv`)
      .expect(200);

    // Designate attending for an event
    await request(app)
      .put('/event/attend')
      .send({ token: admin.body.token, eventId: event.body.eventId })
      .expect(200);

    // Delete the event
    await request(app)
      .delete('/event')
      .query({ token: admin.body.token, eventId: event.body.eventId })
      .expect(200);
  });
});
