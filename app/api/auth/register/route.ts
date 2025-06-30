import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";


const hashPassword = (pass: string) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pass, salt);
    return hash;
}

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ message: 'Email and Password both are required.' }, { status: 400 });
        }
        const hashed_pwd: string = hashPassword(password);
        const userCreated = await pool.query(
            `INSERT INTO users (email, hashed_password) VALUES ($1, $2) RETURNING id, created_at`,
            [email, hashed_pwd]
        );
        return NextResponse.json(
            { message: 'Registered Successfully', user: userCreated.rows },
            { status: 201 }
        );
    } catch (error: unknown) {
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }

};