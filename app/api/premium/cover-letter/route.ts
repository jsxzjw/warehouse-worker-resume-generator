import { NextRequest, NextResponse } from 'next/server';
import { getUserUsage } from '../../../lib/quota';
import { generateCoverLetter } from '../../../lib/ai/generateCoverLetter';

export async function POST(req: NextRequest) {
  try {
    const { email, userName, targetCompany, targetJobTitle, jobDescription, resumeSummary } = await req.json();

    if (!email || !userName || !targetCompany || !targetJobTitle || !jobDescription || !resumeSummary) {
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

    const result = await generateCoverLetter({
      userName,
      targetCompany,
      targetJobTitle,
      jobDescription,
      resumeSummary,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Premium Cover Letter Error]', error);
    return NextResponse.json(
      { error: 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
}
