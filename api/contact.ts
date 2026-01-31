import { sql } from '@vercel/postgres';
import { Resend } from 'resend';

export default async function handler(request: any, response: any) {
    console.log('API Contact endpoint hit');

    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { name, email, subject, message } = request.body;
        console.log('Received data:', { name, email, subject });

        if (!name || !email || !message) {
            return response.status(400).json({ error: 'Missing required fields' });
        }

        // 1. Save to Vercel Postgres Database
        try {
            await sql`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255),
                subject VARCHAR(255),
                message TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            );
            `;

            await sql`
            INSERT INTO messages (name, email, subject, message, created_at)
            VALUES (${name}, ${email}, ${subject || 'No Subject'}, ${message}, NOW());
            `;
            console.log('Database insertion successful');
        } catch (dbError) {
            console.error('Database Error:', dbError);
        }

        // 2. Send Email Notification via Resend
        const apiKey = process.env.RESEND_API_KEY;
        if (apiKey) {
            try {
                const resend = new Resend(apiKey);
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
                console.log('Email sent successfully');
            } catch (emailError) {
                console.error('Email Error:', emailError);
            }
        } else {
            console.warn('RESEND_API_KEY is missing, skipping email.');
        }

        return response.status(200).json({ success: true, message: 'Message received' });

    } catch (error) {
        console.error('Critical Handler Error:', error);
        return response.status(500).json({ error: 'Internal Server Error', details: String(error) });
    }
}
