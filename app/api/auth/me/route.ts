import { pool } from "@/lib/db";
import { verifyAccessToken } from "@/lib/tokens";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('access_token')?.value;
        if (!token) return NextResponse.json({ message: 'Token does not provided!' }, { status: 401 });

        // parse token to get user details
        const parsedData = await verifyAccessToken(token);
        if (!parsedData.valid) return NextResponse.json({ message: parsedData.error?.message }, { status: parsedData.error?.name === 'TokenExpiredError' ? 401 : 403 });

        if (
            parsedData.payload &&
            typeof parsedData.payload === "object" &&
            "id" in parsedData.payload
        ) {
            // if everything okay, return user details
            const user = (await pool.query(
                `SELECT id, email, created_at, updated_at FROM users WHERE id = $1`,
                [parsedData.payload.id]
            )).rows;
            if (user.length) return NextResponse.json({ data: user[0] });
            return NextResponse.json({ message: 'User has been deleted somewhere!' }, { status: 400 })
        }
    } catch (error: unknown) {
        return NextResponse.json({ message: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
    }

}