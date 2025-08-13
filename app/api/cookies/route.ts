import { NextRequest, NextResponse } from 'next/server';
import { storeCookies, getCookies, deleteCookies } from '@/lib/cookies';

export async function POST(request: NextRequest) {
  try {
    const { email, cookies, domain } = await request.json();
    
    if (!email || !cookies || !Array.isArray(cookies)) {
      return NextResponse.json(
        { error: 'Email and cookies array are required' },
        { status: 400 }
      );
    }

    const result = await storeCookies(email, cookies, domain);
    
    return NextResponse.json({
      success: true,
      message: `Stored ${result.count} cookies for ${email}`,
      count: result.count
    });

  } catch (error) {
    console.error('Error storing cookies:', error);
    return NextResponse.json(
      { error: 'Failed to store cookies' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const domain = searchParams.get('domain') || 'gale.udemy.com';
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const cookies = await getCookies(email, domain);
    
    return NextResponse.json({
      success: true,
      cookies,
      count: cookies.length
    });

  } catch (error) {
    console.error('Error retrieving cookies:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve cookies' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const domain = searchParams.get('domain');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    await deleteCookies(email, domain || undefined);
    
    return NextResponse.json({
      success: true,
      message: `Deleted cookies for ${email}${domain ? ` on ${domain}` : ''}`
    });

  } catch (error) {
    console.error('Error deleting cookies:', error);
    return NextResponse.json(
      { error: 'Failed to delete cookies' },
      { status: 500 }
    );
  }
}
