import { authService } from "../modules/auth/auth.service";
import { Resend } from 'resend';

const resend = new Resend(process.env.resend_api_key);

export async function sendVerificationEmail(userId: string, email: string) {

    const randomOTP = Math.floor(Math.random() * 900000);

    const token = await authService.createVerificationToken(
        userId,
        randomOTP.toString(),
        "EMAIL_VERIFICATION"
    );

    if (!token) {
        throw new Error("Failed to create verification token");
    }

    const { error } = await resend.emails.send({
        from: "Postvault <onboarding@resend.dev>",
        to: [email],
        subject: "Email Verification",
        html: `
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 30px; border-radius: 10px;">
                        <h1 style="color: #333;">Verify Your Email</h1>
                        <p style="font-size: 16px; color: #666;">
                            Thank you for signing up! Your verification code is:
                        </p>
                        <div style="background: white; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #007bff; border-radius: 5px; margin: 20px 0;">
                            ${randomOTP}
                        </div>
                        <p style="font-size: 14px; color: #999;">
                            This code will expire in 10 minutes.
                        </p>
                        <p style="font-size: 14px; color: #999;">
                            If you didn't request this, please ignore this email.
                        </p>
                    </div>
                </body>
                </html>
                `
    });

    if (error) {
        throw new Error("Failed to send email");
    }

    return token.id; // Return only the ID
};