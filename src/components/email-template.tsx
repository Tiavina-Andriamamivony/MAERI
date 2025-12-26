import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Section,
    Text,
    Hr,
    Font,
    Row,
    Column,
} from '@react-email/components';

interface EmailTemplateProps {
    name: string;
    company?: string;
    services: string[];
    contact: string;
    location: string;
    message: string;
}

const baseUrl = 'https://maeri.vercel.app';

export const EmailTemplate = ({
    name,
    company,
    services,
    contact,
    location,
    message,
}: EmailTemplateProps) => (
    <Html>
        <Head>
            <Font
                fontFamily="Quicksand"
                fallbackFontFamily="sans-serif"
                webFont={{
                    url: 'https://fonts.gstatic.com/s/quicksand/v30/6xKtdSZaM9iE8KbpRA_hK1QN.woff2',
                    format: 'woff2',
                }}
                fontWeight={400}
                fontStyle="normal"
            />
        </Head>
        <Preview>Nouvelle demande de devis de {name}</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={logoSection}>
                    <Img
                        src={`/logo_bg.png`}
                        width="150"
                        height="auto"
                        alt="MA-ERI Consulting"
                        style={logo}
                    />
                </Section>
                <Section style={headerSection}>
                    <Heading style={h1}>Nouvelle Demande</Heading>
                    <Text style={subtitle}>Un client souhaite collaborer avec vous.</Text>
                </Section>

                <Section style={contentSection}>
                    <Hr style={hr} />
                    <Row>
                        <Column>
                            <Text style={label}>Nom & Prénom</Text>
                            <Text style={value}>{name}</Text>
                        </Column>
                        {company && (
                            <Column>
                                <Text style={label}>Société</Text>
                                <Text style={value}>{company}</Text>
                            </Column>
                        )}
                    </Row>
                    <Row style={{ marginTop: '16px' }}>
                        <Column>
                            <Text style={label}>Contact</Text>
                            <Text style={value}>{contact}</Text>
                        </Column>
                        <Column>
                            <Text style={label}>Localisation</Text>
                            <Text style={value}>{location}</Text>
                        </Column>
                    </Row>

                    <Hr style={hr} />

                    <Text style={label}>Services Demandés</Text>
                    <ul style={list}>
                        {services.map((service, index) => (
                            <li key={index} style={listItem}>{service}</li>
                        ))}
                    </ul>

                    <Hr style={hr} />

                    <Text style={label}>Message</Text>
                    <Section style={messageBox}>
                        <Text style={messageText}>
                            {message}
                        </Text>
                    </Section>
                </Section>

                <Section style={footer}>
                    <Text style={footerText}>
                        © 2024 MA-ERI Consulting. Tous droits réservés.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

const main = {
    backgroundColor: '#f3f4f6',
    fontFamily: "'Quicksand', sans-serif",
    padding: '40px 0',
};

const container = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    margin: '0 auto',
    padding: '40px',
    maxWidth: '600px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
};

const logoSection = {
    textAlign: 'center' as const,
    marginBottom: '32px',
};

const logo = {
    margin: '0 auto',
};

const headerSection = {
    textAlign: 'center' as const,
    marginBottom: '24px',
};

const h1 = {
    color: '#111827',
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '32px',
    margin: '0',
};

const subtitle = {
    color: '#6b7280',
    fontSize: '16px',
    marginTop: '8px',
};

const contentSection = {
    padding: '0 12px',
};

const label = {
    color: '#6b7280',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    margin: '0 0 4px',
};

const value = {
    color: '#111827',
    fontSize: '16px',
    fontWeight: '500',
    margin: '0',
};

const list = {
    paddingLeft: '20px',
    margin: '8px 0 24px',
};

const listItem = {
    color: '#374151',
    fontSize: '15px',
    marginBottom: '6px',
};

const messageBox = {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '8px',
    border: '1px solid #f3f4f6',
};

const messageText = {
    color: '#374151',
    fontSize: '15px',
    lineHeight: '24px',
    whiteSpace: 'pre-wrap' as const,
    margin: '0',
};

const hr = {
    borderColor: '#e5e7eb',
    margin: '24px 0',
};

const footer = {
    marginTop: '32px',
    textAlign: 'center' as const,
};

const footerText = {
    color: '#9ca3af',
    fontSize: '12px',
};
