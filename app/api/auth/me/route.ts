import { pool } from "@/lib/db";
import { verifyAccessToken } from "@/lib/tokens";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('access_token')?.value;
        if (!token) return NextResponse.json({ message: 'Token does not provided!' }, { status: 401 });

        // parse token to get user details
        const parsedToken = await verifyAccessToken(token);
        if (typeof parsedToken === "object" && parsedToken !== null && "id" in parsedToken && "exp" in parsedToken) {
            const exp = parsedToken?.exp || 0;
            const now = Math.floor(Date.now() / 1000); // current time in seconds

            // comaping expiry of token to current date
            if (exp < now) return NextResponse.json({ message: 'Expired JWT!' }, { status: 401 })

            // if everything okay, return user details
            const user = (await pool.query(`SELECT id, email, created_at, updated_at FROM users WHERE id = $1`, [parsedToken.id])).rows;
            if (user.length) return NextResponse.json({ data: user[0] });
            return NextResponse.json({ message: 'User has been deleted somewhere!' }, { status: 400 })
        }
        // token has been altered
        else {
            return NextResponse.json({ message: 'Invalid JWT!' }, { status: 401 })
        }
    } catch (error: unknown) {
        return NextResponse.json({ message: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
    }

}