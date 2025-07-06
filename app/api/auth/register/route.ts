import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";
import sendMail from "@/lib/nodemailer";
import { htmlBody } from "@/lib/RegistrationTemplate";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ message: 'Email and Password both are required.' }, { status: 400 });
        }
        const hashed_pwd: string = hashPassword(password);
        const userCreated = (await pool.query(
            `INSERT INTO users (email, hashed_password) VALUES ($1, $2) RETURNING id, created_at`,
            [email, hashed_pwd]
        )).rows;
        const html = htmlBody(req.nextUrl.origin)
        if (userCreated.length) sendMail(email, 'Account Created on NoteX', `You have successfully registered on NoteX`, html)
        return NextResponse.json(
            { message: 'Registered Successfully', user: userCreated },
            { status: 201 }
        );

    } catch (error: unknown) {
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
};