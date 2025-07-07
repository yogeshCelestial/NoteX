import { pool } from "@/lib/db";
import { comparePassword } from "@/lib/password";
import { hashToken, issueAccessToken, issueRefreshToken } from "@/lib/tokens";
import { NextRequest, NextResponse } from "next/server";
import { v4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ message: 'Email and Password both are required for login' }, { status: 400 });
        }
        // get user details from db
        const data = (await pool.query(`SELECT id, email, hashed_password FROM users WHERE email=$1`, [email])).rows;

        // if user is not registered
        if (data.length === 0) return NextResponse.json({ message: 'User with this email is not registered!' }, { status: 400 });

        const { hashed_password, id = '' } = data[0];
        const isPasswordCorrect = await comparePassword(password, hashed_password);

        // if wrong password
        if (!isPasswordCorrect) return NextResponse.json({ message: 'Unauthorised!' }, { status: 401 });

        // if everything okay - generate access token and refresh token
        const uuid = v4();

        const refresh_token = await issueRefreshToken({ id: uuid });
        const hashed_token = await hashToken(refresh_token);

        const session = (await pool.query(`INSERT INTO sessions (id, token, user_id) VALUES ($1, $2, $3) RETURNING id`, [uuid, hashed_token, id])).rows;
        const sessionId = session[0]?.id;

        // sending refresh token to frontend
        if (sessionId) {
            const response = NextResponse.json({ message: 'Cookie set!'});
            response.cookies.set('refresh_token', refresh_token, {
                httpOnly: true, // Recommended for security
                secure: process.env.NODE_ENV === 'production', // Use secure in production
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
            });
            const token = await issueAccessToken({ id: id });

            // setting access-token to secure cookies
            response.cookies.set('access_token', token, {
                httpOnly: true, // Recommended for security
                secure: process.env.NODE_ENV === 'production', // Use secure in production
                maxAge: 60 * 60, // 1 hr
                path: '/',
            });
            return response;
        }
    } catch (error: unknown) {
        return NextResponse.json({ message: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
    }
}
