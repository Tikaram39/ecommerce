import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const templates = {
  resetPassword: (data) => `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #e0e0e0;border-radius:10px;">
      <h2 style="color:#6C63FF;">Password Reset Request</h2>
      <p>Hi <strong>${data.name}</strong>,</p>
      <p>Click the button below to reset your password. This link expires in 15 minutes.</p>
      <a href="${data.resetUrl}" style="display:inline-block;padding:12px 30px;background:#6C63FF;color:#fff;text-decoration:none;border-radius:6px;margin:20px 0;">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `,
  orderConfirmation: (data) => `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
      <h2 style="color:#6C63FF;">Order Confirmed! 🎉</h2>
      <p>Hi <strong>${data.name}</strong>, your order <strong>#${data.orderId}</strong> has been placed.</p>
      <p>Total: <strong>Rs. ${data.total}</strong></p>
      <p>We'll notify you once your order is shipped.</p>
    </div>
  `,
};

const sendEmail = async ({ to, subject, template, data }) => {
  const html = templates[template]?.(data) || data.html;

  await transporter.sendMail({
    from: `"ShopNow" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;
