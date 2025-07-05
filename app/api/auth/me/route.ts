import { pool } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        return await withAuth(req, async (payload) => {
            if (
                payload &&
                typeof payload === "object" &&
                "id" in payload
            ) {
                // if everything okay, return user details
                const user = (await pool.query(
                    `SELECT id, email, created_at, updated_at FROM users WHERE id = $1`,
                    [(payload as { id: string }).id]
                )).rows;
                if (user.length) return NextResponse.json({ data: user[0] });
                return NextResponse.json({ message: 'User has been deleted somewhere!' }, { status: 400 });
            }
            return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
        })
    } catch (error: unknown) {
        return NextResponse.json({ message: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
    }

}