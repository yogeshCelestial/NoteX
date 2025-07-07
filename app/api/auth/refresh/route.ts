import { pool } from "@/lib/db";
import { compareTokens, hashToken, issueAccessToken, issueRefreshToken, verifyRefreshToken } from "@/lib/tokens";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const token = String(req.cookies.get('refresh_token'));
        const result = await verifyRefreshToken(token);
        if (!result.valid) return NextResponse.json({ message: result.error?.message }, { status: 401 });
        const { payload = {} } = result;
        let sessionId: string | undefined = undefined;
        if (typeof payload === "object" && payload !== null && "session_id" in payload) {
            // check if there is a session exist
            sessionId = (result.payload as { session_id?: string }).session_id;
            const session = (await pool.query(`SELECT token, is_active, user_id FROM sessions WHERE id=$1`, [sessionId])).rows;

            if (session.length === 0) return NextResponse.json({ message: 'No Sessions Available!' }, { status: 401 });

            // compare tokens
            const compare = await compareTokens(token!, session[0]?.token);
            if (!compare) NextResponse.json({ message: 'Suspecious Activity Detected!' }, { status: 401 });

            // issue new refresh token
            const refresh_token = await issueRefreshToken({ id: sessionId! });
            const hashed_token = await hashToken(refresh_token);

            const sessionUpdated = (await pool.query(`UPDATE sessions SET token = $2, last_used = NOW() WHERE id = $1 RETURNING id`, [sessionId, hashed_token])).rows;

            // sending new refresh token to frontend
            if (sessionUpdated) {
                const response = NextResponse.json({ message: 'Cookie set!' });
                response.cookies.set('refresh_token', refresh_token, {
                    httpOnly: true, // Recommended for security
                    secure: process.env.NODE_ENV === 'production', // Use secure in production
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                    path: '/',
                });
                const token = await issueAccessToken({ id: session[0]?.user_id });

                // setting access-token to secure cookies
                response.cookies.set('access_token', token, {
                    httpOnly: true, // Recommended for security
                    secure: process.env.NODE_ENV === 'production', // Use secure in production
                    maxAge: 60 * 60, // 1 hr
                    path: '/',
                });
                return response;
            }
        }
    } catch (error: unknown) {
        console.log(error)
        return NextResponse.json({ mesaage: error instanceof Error ? error?.message : 'Internal Server Error!' }, { status: 500 });
    }

};