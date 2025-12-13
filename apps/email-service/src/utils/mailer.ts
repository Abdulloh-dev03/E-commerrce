import { google } from 'googleapis';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

function createMail(to: string, subject: string, body: string): string {
    const raw = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=utf-8',
        '',
        body,
    ].join('\n');

    // Convert the string to a Base64url-encoded string
    return Buffer.from(raw).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

/**
 * Sends an email using the Gmail API
 * @param to 
 * @param subject 
 * @param htmlBody 
 */
export async function sendGmail(to: string, subject: string, htmlBody: string): Promise<void> {
    try {
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        
        const base64Email = createMail(to, subject, htmlBody);

        await gmail.users.messages.send({
            userId: to,
            requestBody: {
                raw: base64Email,
            },
        });

    } catch (error) {
        console.error('Error sending email via Gmail API:', error);
        throw new Error('Failed to send email.');
    }
}