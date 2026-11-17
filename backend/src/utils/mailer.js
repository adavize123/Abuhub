/**
 * Mailer utility
 * - Attempts to use nodemailer when SMTP config is provided
 * - Falls back to console/file logging when nodemailer or SMTP config is missing
 */

import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const LOG_DIR = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

async function tryImportNodemailer() {
  try {
    const mod = await import('nodemailer');
    return mod.default || mod;
  } catch (err) {
    return null;
  }
}

export async function sendNewTestimonialNotification(testimonial) {
  const recipient = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.NOTIFY_EMAILS || process.env.ADMIN_EMAIL || 'admin@example.com';

  const subject = `New Testimonial Submitted: ${testimonial.name || 'Anonymous'}`;
  const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
  const apiUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;

  // generate action tokens for approve / delete
  const actionSecret = process.env.EMAIL_ACTION_SECRET || process.env.JWT_SECRET || 'dev-secret';
  const actionExpires = process.env.EMAIL_ACTION_EXPIRES || '7d';

  const makeActionToken = (action) => jwt.sign({ testimonialId: testimonial.id, action }, actionSecret, { expiresIn: actionExpires });

  const approveToken = makeActionToken('publish');
  const unpublishToken = makeActionToken('unpublish');
  const deleteToken = makeActionToken('delete');

  const approveLink = `${frontend}/admin/testimonials/action?token=${approveToken}&action=publish`;
  const unpublishLink = `${frontend}/admin/testimonials/action?token=${unpublishToken}&action=unpublish`;
  const deleteLink = `${frontend}/admin/testimonials/action?token=${deleteToken}&action=delete`;

  const html = `
    <p>A new testimonial was submitted on ABUHUB:</p>
    <p><strong>Name:</strong> ${testimonial.name || '—'}</p>
    <p><strong>Role:</strong> ${testimonial.role || '—'}</p>
    <p><strong>Quote:</strong><br/>${testimonial.quote}</p>
    <p><small>Published: ${testimonial.isPublished ? 'yes' : 'no'}</small></p>
    <p>Quick actions:</p>
    <p>
      <a href="${approveLink}">Approve (publish)</a> |
      <a href="${unpublishLink}">Unpublish</a> |
      <a href="${deleteLink}">Delete</a>
    </p>
    <p>Or manage all testimonials in your admin dashboard: <a href="${frontend}/admin/testimonials">Admin Testimonials</a></p>
  `;

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  const nodemailer = await tryImportNodemailer();
  if (nodemailer && smtpHost && smtpPort) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465, // true for 465, false for other ports
        auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
      });

      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.SMTP_FROM || smtpUser || 'no-reply@abuhub.local',
        to: recipient,
        subject,
        html,
      });

      // log success
      fs.appendFileSync(path.join(LOG_DIR, 'mailer.log'), `${new Date().toISOString()} SENT: ${subject} -> ${recipient} (messageId=${info.messageId || 'n/a'})\n`);
      return { success: true, info };
    } catch (err) {
      fs.appendFileSync(path.join(LOG_DIR, 'mailer.log'), `${new Date().toISOString()} ERROR sending: ${err.message}\n`);
      return { success: false, error: err.message };
    }
  }

  // If nodemailer is available but SMTP host not provided, try Ethereal test account for real SMTP testing
  if (nodemailer && !(smtpHost && smtpPort)) {
    try {
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });

      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || testAccount.user,
        to: recipient,
        subject,
        html,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info) || null;
      fs.appendFileSync(path.join(LOG_DIR, 'mailer.log'), `${new Date().toISOString()} SENT (ethereal): ${subject} -> ${recipient} (preview=${previewUrl})\n`);
      return { success: true, info, previewUrl };
    } catch (err) {
      fs.appendFileSync(path.join(LOG_DIR, 'mailer.log'), `${new Date().toISOString()} ERROR sending via ethereal: ${err.message}\n`);
      // fall through to fallback
    }
  }

  // Fallback: write to file and console
  const dump = `\n--- New Testimonial Notification (${new Date().toISOString()}) ---\nTo: ${recipient}\nSubject: ${subject}\n${html}\n`;
  fs.appendFileSync(path.join(LOG_DIR, 'mailer_fallback.log'), dump);
  console.log('Mailer fallback (no SMTP or nodemailer):', subject, '->', recipient);
  return { success: false, fallback: true };
}

export default { sendNewTestimonialNotification };
