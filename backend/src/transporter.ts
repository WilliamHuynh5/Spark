/* istanbul ignore file */
/* This has been extensively whitebox tested, however due to the requirement of an email application to completely
test this, it is impossible to purely blackbox test it within the backend */
import nodemailer from 'nodemailer';

/**
 * Returns the transporter used to send emails.
 * @returns Transporter to send emails with.
 */
export const getTransporter = async () => {
  // Putting this here so that it is not ran on every supertest
  if (process.env.NODE_ENV === 'production') {
    // all emails are delivered to destination
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  } else {
    // all emails are catched by ethereal.email
    const {
      smtp: { host, port, secure },
      user,
      pass,
    } = await nodemailer.createTestAccount();

    console.log(`Etheral account details:\n\tUser: ${user}\n\tPass: ${pass}`);

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: user, // generated ethereal user
        pass: pass, // generated ethereal password
      },
    });
  }
};
