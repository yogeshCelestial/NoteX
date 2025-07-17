import { JWTPayload, withAuth } from "@/lib/middleware";
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const POST = async (req: NextRequest) => {
    try {
        return await withAuth(req, async (payload: JWTPayload) => {
            if (typeof payload === "object" && payload !== null && "id" in payload) {
                const id = (payload as { id: string }).id;
                const { title, description, bg_color = '', is_pinned = false } = await req.json();
                if (!title && !description) return NextResponse.json({ message: 'Title/Content is necessory' }, { status: 400 });
                const inserted = (await pool.query(`INSERT INTO notes (title, description, bg_color, is_pinned, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING id;`, [title, description, bg_color, is_pinned, id]))?.rows;
                if (!inserted.length) return NextResponse.json({ message: 'Some Error Occured at Database' }, { status: 500 });
                return NextResponse.json({ message: 'Note Created!' }, { status: 201 });
            }
            return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
    }
}

export const GET = async (req: NextRequest) => {
    try {
        return await withAuth(req, async (payload: JWTPayload) => {
            if (typeof payload === "object" && payload !== null && "id" in payload) {
                const id = (payload as { id: string }).id;
                const notes = (await pool.query(`SELECT * FROM notes WHERE created_by = $1;`, [id]))?.rows;
                if (!notes?.length) return NextResponse.json({ message: 'No Notes found for this user!', notes }, { status: 200 });
                return NextResponse.json({ message: 'Note Created!', notes }, { status: 200 });
            }
            return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
    }
}