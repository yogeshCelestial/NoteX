import { pool } from "@/lib/db";
import { verifyRefreshToken } from "@/lib/tokens";
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const token = String(req.cookies.get('refresh_token'));
    const result = await verifyRefreshToken(token!);
    let sessionId: string | undefined = undefined;
    if (result.valid && typeof result.payload === "object" && result.payload !== null && "session_id" in result.payload) {
        // check if there is a session exist
        sessionId = (result.payload as { session_id?: string }).session_id;
        if (sessionId) {
            await pool.query(`DELETE FROM sessions WHERE id = $1`, [sessionId]);
        }
    }
    const response = NextResponse.json({ message: 'logout success' });
    response.cookies.set('access_token', '', { maxAge: 0 });
    response.cookies.set('refresh_token', '', { maxAge: 0 });
    return response;
}