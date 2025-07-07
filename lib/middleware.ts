import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "./tokens";
import jwt from 'jsonwebtoken';

export type JWTPayload = {
    [key: string]: string,
} | string | jwt.JwtPayload;

export const withAuth = async (req: NextRequest,   handler: (abc: JWTPayload ) => Promise<NextResponse>) => {
    const token = req.cookies.get('access_token')?.value;
    if (!token) return NextResponse.json({ message: 'No Token Provided!'}, { status: 401 });
    const parsed = await verifyAccessToken(token);
    if (parsed?.valid && parsed?.payload) {
        return handler(parsed.payload);
    } else {
        return NextResponse.json({ message: parsed.error?.message }, { status: 401 });
    }
}