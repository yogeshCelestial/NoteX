/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";

export const issueAccessToken = async (user: { id: string }) => {
    const { id } = user;
    const access_token = await jwt.sign({ id: id }, process.env.JWT_SECRET!, { algorithm: 'HS256', expiresIn: '1h' });
    return access_token;
}

export const verifyAccessToken = async (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        return { valid: true, payload: decoded };
    } catch (error: any) {
        return {
            valid: false,
            error: {
                name: error.name,
                message: error.message
            }
        };
    }
};

export const issueRefreshToken = async (user: { id: string }) => {
    const { id } = user;
    const refresh_token = await jwt.sign({ session_id: id }, process.env.SESSION_SECRET!, { algorithm: 'HS256', expiresIn: '7d' });
    return refresh_token;
}

export const verifyRefreshToken = async (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env.SESSION_SECRET!);
        return { valid: true, payload: decoded };
    } catch (error: any) {
        return {
            valid: false,
            error: {
                name: error.name,
                message: error.message
            }
        };
    }
};

export const decodeJWT = async (token: string) => {
    const result = await jwt.decode(token);
    return result;
}

export const compareTokens = async (req_token: string, db_token: string) => {
    const result = await bcrypt.compare(req_token, db_token);
    return result;
};

export const hashToken = (token: string) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(token, salt);
    return hash;
} 