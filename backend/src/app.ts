import express, { Request, Response, json } from 'express';
import expressAsyncHandler from 'express-async-handler';
import errorHandler from './middleware/errorHandler';
import { echo } from './echo';
import { authLogin, authLogout, authRegister } from './auth';
import {
  societyApply,
  societyDelete,
  societyEdit,
  societyEvents,
  societyJoin,
  societyList,
  societyMembers,
  societyView,
} from './society';
import { permSiteAllocate, permSocietyAllocate } from './perm';
import {
  adminApplicationApprove,
  adminApplicationDeny,
  adminApplicationList,
  adminGetUserByZid,
  adminGetUsers,
  adminUserRemove,
} from './admin';
import { clear } from './data';
import {
  profileEdit,
  profileEvents,
  profileSocieties,
  profileView,
} from './profile';
import cors from 'cors';
import {
  createEvent,
  getEvent,
  deleteEvent,
  attendEvent,
  eventStatus,
  unattendEvent,
  editEvent,
  getEvents,
  fillForm,
  generateCSV,
} from './event';
import { authResetGenerate, authResetUse } from './reset';

const app = express();

app.use(json());
app.use(cors());
app.use('/calendar', express.static('cals'));
app.use('/attendance', express.static('attendance'));

/* Backend Only Routes: */
app.get(
  '/',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json({ message: 'Hello World!' });
  }),
);

app.post(
  '/echo',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.send(echo(req.body));
  }),
);

app.delete(
  '/clear',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(await clear());
  }),
);

/* '/auth' Routes: */
app.post(
  '/auth/register',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await authRegister({
        email: req.body.email as string,
        nameFirst: req.body.nameFirst as string,
        nameLast: req.body.nameLast as string,
        password: req.body.password as string,
        zId: req.body.zId as string,
      }),
    );
  }),
);

app.post(
  '/auth/login',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await authLogin(req.body.email as string, req.body.password as string),
    );
  }),
);

app.put(
  '/auth/logout',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(await authLogout(req.body.token as string));
  }),
);

app.get(
  '/auth/reset',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(await authResetGenerate(req.query.email as string));
  }),
);

app.post(
  '/auth/reset',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await authResetUse(req.body.code as string, req.body.password as string),
    );
  }),
);

/* '/perm' routes */
app.post(
  '/perm/site/allocate',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await permSiteAllocate(
        req.body.token as string,
        req.body.userId as number,
        req.body.permLevel as number,
      ),
    );
  }),
);

app.post(
  '/perm/society/allocate',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await permSocietyAllocate(
        req.body.token as string,
        req.body.userId as number,
        req.body.societyId as number,
        req.body.permLevel as number,
      ),
    );
  }),
);

/* '/admin' routes */
app.get(
  '/admin/user/get',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(await adminGetUserByZid(req.query.zId as string));
  }),
);

app.put(
  '/admin/application/approve',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await adminApplicationApprove(
        req.body.token as string,
        req.body.applicationId as number,
      ),
    );
  }),
);

app.put(
  '/admin/application/deny',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await adminApplicationDeny(
        req.body.token as string,
        req.body.applicationId as number,
      ),
    );
  }),
);

app.get(
  '/admin/users',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(await adminGetUsers(req.query.token as string));
  }),
);

app.get(
  '/admin/application/list',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(await adminApplicationList(req.query.token as string));
  }),
);

app.delete(
  '/admin/user/remove',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await adminUserRemove(
        req.query.token as string,
        parseInt(req.query.userId as string),
      ),
    );
  }),
);

/* '/society' routes */
app.post(
  '/society/apply',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await societyApply(
        req.body.token as string,
        req.body.societyName as string,
        req.body.description as string,
      ),
    );
  }),
);

app.post(
  '/society/join',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await societyJoin(req.body.token as string, req.body.societyId as number),
    );
  }),
);

app.get(
  '/society/view',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(await societyView(parseInt(req.query.societyId as string)));
  }),
);

app.get(
  '/society/members',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(await societyMembers(parseInt(req.query.societyId as string)));
  }),
);

app.put(
  '/society/edit',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await societyEdit(
        req.body.token as string,
        req.body.societyId as number,
        req.body.societyName as string,
        req.body.description as string,
      ),
    );
  }),
);

app.get(
  '/society/events',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await societyEvents(parseInt(req.query.societyId as string) as number),
    );
  }),
);

app.delete(
  '/society',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await societyDelete(
        req.query.token as string,
        parseInt(req.query.societyId as string) as number,
      ),
    );
  }),
);

app.get(
  '/society/list',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await societyList(
        req.query.searchString as string,
        parseInt(req.query.paginationStart as string),
        parseInt(req.query.paginationEnd as string),
      ),
    );
  }),
);

/* '/profile' routes */
app.get(
  '/profile/view',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(await profileView(req.query.token as string));
  }),
);

app.put(
  '/profile/edit',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await profileEdit(
        req.body.token as string,
        req.body.nameFirst as string,
        req.body.nameLast as string,
        req.body.email as string,
      ),
    );
  }),
);

app.get(
  '/profile/societies',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(await profileSocieties(req.query.token as string));
  }),
);

app.get(
  '/profile/events',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(await profileEvents(req.query.token as string));
  }),
);

/* '/event/ routes: */
app.get(
  '/event',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(await getEvent(parseInt(req.query.eventId as string) as number));
  }),
);

app.post(
  '/event',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await createEvent(
        req.body.token as string,
        req.body.societyId as number,
        req.body.name as string,
        req.body.description as string,
        new Date(req.body.time as string), // util.format(Date())
        req.body.location as string,
      ),
    );
  }),
);

app.put(
  '/event/edit',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await editEvent(
        req.body.token as string,
        req.body.eventId as number,
        req.body.name as string,
        req.body.description as string,
        new Date(req.body.time as string), // util.format(Date())
        req.body.location as string,
      ),
    );
  }),
);

app.delete(
  '/event',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await deleteEvent(
        req.query.token as string,
        parseInt(req.query.eventId as string) as number,
      ),
    );
  }),
);

app.put(
  '/event/attend',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await attendEvent(req.body.token as string, req.body.eventId as number),
    );
  }),
);

app.delete(
  '/event/attend',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await unattendEvent(
        req.query.token as string,
        parseInt(req.query.eventId as string) as number,
      ),
    );
  }),
);

app.get(
  '/event/status',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await eventStatus(
        req.query.token as string,
        parseInt(req.query.eventId as string) as number,
      ),
    );
  }),
);

app.get(
  '/event/list',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await getEvents(
        req.query.searchString as string,
        req.query.timeStart as string,
        req.query.timeEnd as string,
        parseInt(req.query.paginationStart as string),
        parseInt(req.query.paginationEnd as string),
      ),
    );
  }),
);

app.post(
  '/event/form',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await fillForm(
        req.body.eventId as number,
        req.body.nameFirst as string,
        req.body.nameLast as string,
        req.body.zId as string,
        req.body.email as string,
      ),
    );
  }),
);

app.post(
  '/event/generateCSV',
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json(
      await generateCSV(req.body.token as string, req.body.eventId as number),
    );
  }),
);

app.use(errorHandler());

export default app;
