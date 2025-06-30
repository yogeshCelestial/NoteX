import { NextResponse } from 'next/server';

type ResponseData = {
    message: string
}

export function GET(
) {
    return NextResponse.json({
        message: 'Hello, Next.js!'
    } as ResponseData);

}