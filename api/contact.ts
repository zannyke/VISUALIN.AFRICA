import { sql } from '@vercel/postgres';
import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(request: any, response: any) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { name, email, subject, message } = request.body;

        if (!name || !email || !message) {
            return response.status(400).json({ error: 'Missing required fields' });
        }

        // 1. Save to Vercel Postgres Database
        try {
            await sql`
        INSERT INTO messages (name, email, subject, message, created_at)
        VALUES (${name}, ${email}, ${subject || 'No Subject'}, ${message}, NOW());
        `;
        } catch (dbError) {
            console.error('Database Error:', dbError);
        }

        // 2. Send Email Notification via Resend
        try {
            await resend.emails.send({
                from: 'Visualink Website <onboarding@resend.dev>',
                to: 'visualinkafrica@gmail.com',
                replyTo: email,
                subject: `[New Inquiry] ${subject || 'No Subject'}`,
                html: `
            <div style="font-family: sans-serif; padding: 20px;">
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; margin-top: 10px;">
                <strong>Message:</strong><br/>
                ${message}
            </div>
            </div>
        `
            });
        } catch (emailError) {
            console.error('Email Error:', emailError);
        }

        return response.status(200).json({ success: true, message: 'Message received' });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}
