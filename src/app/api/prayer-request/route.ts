import { NextRequest, NextResponse } from 'next/server';

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

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const data = await response.json();
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

    const values = [[
      timestamp,
      name,
      email || '',
      prayerRequest,
      isPrivate ? 'Yes' : 'No',
      'New',
    ]];

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Prayer request submission error:', error);
    const message = error instanceof Error ? error.message : 'Failed to submit prayer request';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
