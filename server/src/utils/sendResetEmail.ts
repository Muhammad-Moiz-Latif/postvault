import { authService } from "../modules/auth/auth.service";
import { Resend } from 'resend';

const resend = new Resend(process.env.resend_api_key);

export async function sendResetEmail(username: string, email: string, resetLink: string) {
    try {
        const { error } = await resend.emails.send({
            from: "Postvault <onboarding@resend.dev>",
            to: [email],
            subject: 'Reset Your Password',
            html: `
                    <h2>Hi ${username},</h2>
                    <p>You requested to reset your password.</p>
                    <p>Click the link below to reset your password:</p>
                    <a href="${resetLink}" style="
                        display: inline-block;
                        padding: 12px 24px;
                        background-color: #007bff;
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                        margin: 20px 0;
                    ">Reset Password</a>
                    <p>Or copy and paste this link into your browser:</p>
                    <p>${resetLink}</p>
                    <p><strong>This link will expire in 1 hour.</strong></p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <hr>
                    <p style="color: #666; font-size: 12px;">
                        For security reasons, this link can only be used once.
                    </p>
                `
        });

        if (error) {
            console.error(error);
            throw new Error("Failed to send email");
        }

        return { success: true };
    } catch (error) {
        console.error("Email sending error:", error);
        throw error;
    }
};