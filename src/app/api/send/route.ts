import { EmailTemplate } from '@/components/email-template';
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    console.log('Starting POST /api/send');
    try {
        const body = await request.json();
        console.log('Request body received:', body);

        const { name, company, services, contact, location, message } = body;

        console.log('Attempting to send email via Resend...');
        const { data, error } = await resend.emails.send({
            from: 'MA-ERI Website <onboarding@resend.dev>', // Use a verified domain or resend default dev domain
            // to: ['contact-maeri@telma.net'],
            // cc: ['maeri.consulting.2024@gmail.com'],
            to: ['maeri.consulting.2024@gmail.com'], // Restricted to account email in dev mode without domain verification
            subject: `Nouvelle demande de devis : ${name}`,
            react: EmailTemplate({
                name,
                company,
                services,
                contact,
                location,
                message
            }),
        });

        if (error) {
            console.error('Resend API Error:', error);
            return NextResponse.json({ error }, { status: 500 });
        }

        console.log('Email sent successfully:', data);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Internal Server Error in /api/send:', error);
        return NextResponse.json({ error }, { status: 500 });
    }
}
