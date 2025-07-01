import jwt from 'jsonwebtoken';

export const issueAccessToken = async (user: { id: string }) => {
    const { id } = user;
    const access_token = await jwt.sign({ id: id }, process.env.JWT_SECRET!, { algorithm: 'HS256', expiresIn: '1h' });
    return access_token;
}

export const verifyAccessToken = async (token: string) => {
    const result = await jwt.verify(token, process.env.JWT_SECRET!);
    console.log(result);
    return result;
}

export const issueRefreshToken = async (user: { id: string }) => {
    const { id } = user;
    const refresh_token = await jwt.sign({ id: id }, process.env.SESSION_SECRET!, { algorithm: 'HS256', expiresIn: '7d' });
    return refresh_token;
}

export const verifyRefreshToken = async (token: string) => {
    const result = await jwt.verify(token, process.env.SESSION_SECRET!);
    console.log(result);
    return result;
}