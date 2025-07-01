import { pool } from "@/lib/db";
import { verifyRefreshToken } from "@/lib/tokens";
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const authorization = req.headers.get('Authorization');
    const token = authorization?.split(' ')[1];
    const result = await verifyRefreshToken(token!);
    let sessionId: string | undefined = undefined;
    if (typeof result === "object" && result !== null && "session_id" in result) {
        // check if there is a session exist
        sessionId = (result as { session_id?: string }).session_id;
        if (sessionId) {
            await pool.query(`DELETE FROM sessions WHERE id = $1`, [sessionId]);
        }
    }
    const response = NextResponse.json({ message: 'Logout success!' });
    response.cookies.delete('access_token');
    return response;
}