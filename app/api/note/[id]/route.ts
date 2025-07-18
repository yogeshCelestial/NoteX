import { pool } from "@/lib/db";
import { JWTPayload, withAuth } from "@/lib/middleware";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest, context: { params: { id: string } }) => {
    try {
        return await withAuth(req, async (payload: JWTPayload) => {
            if (typeof payload === "object" && payload !== null && "id" in payload) {
                const id = context.params.id;
                const body = await req.json();

                const fields = Object.keys(body); // e.g., ['title', 'content']
                if (fields.length === 0) {
                    return NextResponse.json({ message: 'Atleast one property is required to update!' }, { status: 400 });
                }

                // Build SQL dynamically
                const updates = fields.map((field, idx) => `${field} = $${idx + 1}`).join(', ');
                const values = fields.map((field) => body[field]);

                const query = `UPDATE notes SET ${updates}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *;`;
                const inserted = (await pool.query(query, [...values, id]))?.rows;
                if (!inserted.length) return NextResponse.json({ message: 'Some Error Occured at Database' }, { status: 500 });
                return NextResponse.json({ message: 'Note Updated!' }, { status: 200 });
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

export const DELETE = async (req: NextRequest, context: { params: { id: string } }) => {
    try {
        return await withAuth(req, async (payload: JWTPayload) => {
            if (typeof payload === "object" && payload !== null && "id" in payload) {
                const id = context.params.id;
                
                const query = `DELETE FROM notes WHERE id = $1 RETURNING id;`;
                const deleted = (await pool.query(query, [id]))?.rows;
                if (!deleted.length) return NextResponse.json({ message: 'Some Error Occured at Database' }, { status: 500 });
                return NextResponse.json({ message: 'Note Deleted!', id: deleted[0]?.id || id }, { status: 200 });
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