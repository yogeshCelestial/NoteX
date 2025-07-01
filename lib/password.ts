import bcrypt from "bcryptjs";

export const comparePassword = async (user_password: string, hashed_password: string) => {
    const result = await bcrypt.compare(user_password, hashed_password);
    return result;
};

export const hashPassword = (pass: string) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pass, salt);
    return hash;
}