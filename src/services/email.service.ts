import nodemailer from "nodemailer";

// Cấu hình từ .env
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

if (!SMTP_USER || !SMTP_PASS) {
  console.warn("⚠️ SMTP config missing — email will be logged to console instead");
}

const transporter =
  SMTP_USER && SMTP_PASS
    ? nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: false, // true cho port 465, false cho 587
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      })
    : null;

export class EmailService {
  static async sendResetOtp(email: string, otp: string): Promise<void> {
    const subject = "Mã OTP đặt lại mật khẩu - SEJobs";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333;">Đặt lại mật khẩu</h2>
        <p>Xin chào,</p>
        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản SEJobs.</p>
        <p><strong>Mã OTP của bạn là:</strong></p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #d32f2f;">${otp}</span>
        </div>
        <p>Mã này sẽ hết hạn sau <strong>10 phút</strong>.</p>
        <p>Nếu bạn không yêu cầu thao tác này, vui lòng bỏ qua email này.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #777; font-size: 12px;">© 2026 SEJobs. All rights reserved.</p>
      </div>
    `;

    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"SEJobs" <${SMTP_USER}>`,
          to: email,
          subject,
          html,
        });
        console.log(`✅ Gửi OTP thành công đến: ${email}`);
      } catch (error) {
        console.error("❌ Lỗi gửi email:", error);
        throw new Error("Failed to send email");
      }
    } else {
      // Fallback: in ra terminal
      console.log(`
        📧 [EMAIL GIẢ LẬP] Gửi OTP đến: ${email}
        Mã OTP: ${otp}
        → Cấu hình SMTP trong .env để gửi email thật!
      `);
    }
  }
}
