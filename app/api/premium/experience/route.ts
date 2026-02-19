import { NextRequest, NextResponse } from 'next/server';
import { getUserUsage } from '../../../../lib/quota';
import { generateTailoredExperience } from '../../../../lib/ai/generateExperience';

export async function POST(req: NextRequest) {
  try {
    const { email, originalExperience, jobDescription, targetJobTitle } = await req.json();

    if (!email || !originalExperience || !jobDescription || !targetJobTitle) {
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

    const result = await generateTailoredExperience({
      originalExperience,
      jobDescription,
      targetJobTitle,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Premium Experience Error]', error);
    return NextResponse.json(
      { error: 'Failed to generate optimized experience' },
      { status: 500 }
    );
  }
}
