import { NextResponse } from 'next/server';

export async function POST() {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json({ success: false, error: 'Slack Webhook URL not configured' }, { status: 500 });
  }

  const payload = {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '🦷 *DentistLeads Weekly Summary*',
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: '📊 *247 total leads this week*' },
          { type: 'mrkdwn', text: '📅 *18 appointments booked*' },
          { type: 'mrkdwn', text: '💰 *$47,240 revenue tracked*' },
          { type: 'mrkdwn', text: '🔥 *Top service: Teeth Cleaning (74 leads)*' },
        ],
      },
    ],
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Slack API responded with ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
