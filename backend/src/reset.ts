/* istanbul ignore file */
/* This has been extensively whitebox tested, however due to the requirement of an email application to completely
test this, it is impossible to purely blackbox test it within the backend */
import { prisma } from './data';
import createHTTPError from 'http-errors';
import bcrypt from 'bcrypt';
import { customAlphabet } from 'nanoid';
import isEmail from 'validator/lib/isEmail';
import nodemailer from 'nodemailer';
import { getTransporter } from './transporter';

export const authResetGenerate = async (email: string) => {
  if (!isEmail(email))
    throw new createHTTPError.BadRequest('Invalid email format');
  prisma.user
    .findUniqueOrThrow({
      where: { email: email },
    })
    .then(async (user) => {
      // Generate 6 digit code
      const code = await prisma.resetCode.create({
        data: {
          id: customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)(),
          userId: user.id,
        },
      });

      const transporter = await getTransporter();

      // Send email
      await transporter
        .sendMail({
          from: '"Spark ✨" <noreply@spark.li>',
          to: user.email,
          subject: 'Reset Code',
          text: code.id,
        })
        .then((info) => {
          console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
          console.log(`Reset Code: ${code.id}`);
        });
    })
    .catch((err) => {
      console.log(err);
    });
  return {};
};

export const authResetUse = async (code: string, password: string) => {
  // Validate code and get user
  await prisma.resetCode
    .findUniqueOrThrow({
      where: {
        id: code,
      },
    })
    .then(async (c) => {
      // Update password
      await prisma.user.update({
        data: {
          password: await bcrypt.hash(password, await bcrypt.genSalt()),
        },
        where: {
          id: c.userId,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      throw new createHTTPError.BadRequest('Invalid code');
    });
  return {};
};
