/**
 * Email Service
 * Sends notifications when new testimonials are submitted.
 */

import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const fromAddress = process.env.EMAIL_FROM || process.env.ADMIN_EMAIL || 'no-reply@example.com';
const notifyTo = (process.env.NOTIFY_EMAILS || process.env.ADMIN_EMAIL || '').split(',').map(s => s.trim()).filter(Boolean);

let transporter;
if (smtpHost && smtpPort) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: smtpUser ? { user: smtpUser, pass: smtpPass } : undefined,
  });
} else {
  transporter = null;
}

export const sendNewTestimonialNotification = async (testimonial) => {
  try {
    if (!transporter) {
      console.log('Email not sent: SMTP not configured. Testimonial:', testimonial.name);
      return;
    }

    const to = notifyTo.length ? notifyTo.join(',') : (process.env.ADMIN_EMAIL || 'admin@example.com');
    const subject = `New Testimonial submitted by ${testimonial.name}`;
    const html = `
      <p>A new testimonial was submitted on your site.</p>
      <p><strong>Name:</strong> ${testimonial.name}</p>
      <p><strong>Role:</strong> ${testimonial.role || 'N/A'}</p>
      <p><strong>Quote:</strong> ${testimonial.quote}</p>
      <p><strong>Published:</strong> ${testimonial.isPublished ? 'Yes' : 'No'}</p>
      <p>Review it in the admin panel.</p>
    `;

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      html,
    });

    console.log('Notification email sent:', info.messageId);
  } catch (err) {
    console.error('Failed to send testimonial notification:', err.message || err);
  }
};

export default { sendNewTestimonialNotification };
