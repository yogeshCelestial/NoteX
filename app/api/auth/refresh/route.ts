import { pool } from "@/lib/db";
import { compareTokens, hashToken, issueAccessToken, issueRefreshToken, verifyRefreshToken } from "@/lib/tokens";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const authorization = req.headers.get('Authorization');
        const token = authorization?.split(' ')[1];
        const res = NextResponse.json({ token: token });
        const result = await verifyRefreshToken(token!);
        let sessionId: string | undefined = undefined;
        if (typeof result === "object" && result !== null && "session_id" in result) {
            // check if there is a session exist
            sessionId = (result as { session_id?: string }).session_id;
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
                const response = NextResponse.json({ message: 'Cookie set!', data: { refresh_token: refresh_token } });
                const token = await issueAccessToken({ id: session[0]?.user_id });

                // setting access-token to secure cookies
                response.cookies.set('access-token', token, {
                    httpOnly: true, // Recommended for security
                    secure: process.env.NODE_ENV === 'production', // Use secure in production
                    maxAge: 60 * 60, // 1 hr
                    path: '/',
                });
                return response;
            }
        }
        return res;
    } catch (error: unknown) {
        console.log(error)
        return NextResponse.json({ mesaage: error instanceof Error ? error?.message : 'Internal Server Error!' }, { status: 500 });
    }

};