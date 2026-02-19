import { NextRequest, NextResponse } from 'next/server';
import { getUserUsage } from '../../../lib/quota';
import { calculateATSScore } from '../../../lib/ai/atsScore';

export async function POST(req: NextRequest) {
  try {
    const { email, resumeText, jobDescription } = await req.json();

    if (!email || !resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const user = getUserUsage(email);

    if (user.plan !== 'premium') {
      return NextResponse.json(
        { error: 'This feature is only available for Premium users' },
        { status: 403 }
      );
    }

    const result = await calculateATSScore({
      resumeText,
      jobDescription,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Premium ATS Score Error]', error);
    return NextResponse.json(
      { error: 'Failed to calculate ATS score' },
      { status: 500 }
    );
  }
}
