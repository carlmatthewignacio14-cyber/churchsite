import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const SPREADSHEET_ID = '1TRP3AgxV7mBhcNy3ymS-UY-oZAyjFuu0xOJNh89czXM';
const SHEET_NAME = 'Sheet1';
const GOOGLE_SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

async function getAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Google OAuth credentials in environment variables');
  }

  // Build the token request body
  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('refresh_token', refreshToken);
  params.append('grant_type', 'refresh_token');

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorCode = data.error || 'unknown_error';
    const errorDesc = data.error_description || 'No description provided';

    if (errorCode === 'unauthorized_client') {
      throw new Error(
        'Google OAuth configuration error: The OAuth client credentials do not match the refresh token. ' +
          'Please ensure your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are from a "Web application" type OAuth client '+ 'in Google Cloud Console, and that the GOOGLE_REFRESH_TOKEN was generated using those same credentials. '+ 'You may need to regenerate the refresh token.'
      );
    }

    if (errorCode === 'invalid_grant') {
      throw new Error(
        'Google OAuth token is invalid or expired. Please generate a new refresh token and update the GOOGLE_REFRESH_TOKEN environment variable.'
      );
    }

    if (errorCode === 'invalid_client') {
      throw new Error(
        'Google OAuth client credentials are invalid. Please verify your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the environment variables.'
      );
    }

    throw new Error(`Failed to get access token: ${errorCode} - ${errorDesc}`);
  }

  if (!data.access_token) {
    throw new Error('No access token returned from Google OAuth');
  }

  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, request: prayerRequest, private: isPrivate } = body;

    if (!name || !prayerRequest) {
      return NextResponse.json({ error: 'Name and prayer request are required' }, { status: 400 });
    }

    const accessToken = await getAccessToken();

    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const values = [[timestamp, name, email || '', prayerRequest, isPrivate ? 'Yes' : 'No', 'New']];

    const appendUrl = `${GOOGLE_SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}!A:F:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

    const sheetsResponse = await fetch(appendUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    });

    if (!sheetsResponse.ok) {
      const error = await sheetsResponse.text();
      throw new Error(`Google Sheets API error: ${error}`);
    }

    // Send confirmation email if email was provided
    if (email) {
      try {
        const resendApiKey = process.env.RESEND_API_KEY;
        const fromEmail = 'onboarding@resend.dev';

        if (resendApiKey && resendApiKey !== 'your-resend-api-key-here') {
          const resend = new Resend(resendApiKey);

          const emailResult = await resend.emails.send({
            from: `Church Prayer Team <${fromEmail}>`,
            to: email,
            subject: 'We Received Your Prayer Request',
            html: `
              <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
                <div style="background: #1a1a2e; padding: 32px 40px; text-align: center;">
                  <h1 style="color: #ffffff; font-size: 22px; font-weight: 300; letter-spacing: 0.05em; margin: 0;">
                    Your Prayer Has Been Received
                  </h1>
                </div>
                <div style="padding: 40px; background: #ffffff; border: 1px solid #e5e7eb;">
                  <p style="font-size: 16px; line-height: 1.7; color: #374151; margin-top: 0;">
                    Dear ${name},
                  </p>
                  <p style="font-size: 16px; line-height: 1.7; color: #374151;">
                    Thank you for trusting us with your heart. We have received your prayer request and our dedicated prayer team will be lifting you up before God.
                  </p>
                  ${
                    !isPrivate
                      ? `
                  <div style="background: #f9fafb; border-left: 3px solid #6366f1; padding: 16px 20px; margin: 24px 0;">
                    <p style="font-size: 13px; color: #6b7280; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.08em;">Your Request</p>
                    <p style="font-size: 15px; color: #374151; margin: 0; line-height: 1.6; font-style: italic;">"${prayerRequest}"</p>
                  </div>
                  `
                      : ''
                  }
                  <p style="font-size: 16px; line-height: 1.7; color: #374151;">
                    You are never alone. We believe in the power of prayer and are honored to stand with you.
                  </p>
                  <p style="font-size: 16px; line-height: 1.7; color: #374151; margin-bottom: 0;">
                    With love and prayer,<br />
                    <strong>The Prayer Team</strong>
                  </p>
                </div>
                <div style="padding: 20px 40px; text-align: center; background: #f9fafb; border: 1px solid #e5e7eb; border-top: none;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                    This is an automated confirmation. Please do not reply to this email.
                  </p>
                </div>
              </div>
            `,
          });

          if (emailResult.error) {
            console.error(
              'Resend API returned an error:',
              JSON.stringify(emailResult.error, null, 2)
            );
          } else {
            console.log('Confirmation email sent successfully. ID:', emailResult.data?.id);
          }
        } else {
          console.warn(
            'Resend API key is missing or not configured — skipping confirmation email.'
          );
        }
      } catch (emailError) {
        // Log email error but don't fail the whole request
        console.error(
          'Failed to send confirmation email:',
          emailError instanceof Error ? emailError.message : emailError
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Prayer request submission error:', error);
    const message = error instanceof Error ? error.message : 'Failed to submit prayer request';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
