import Bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function hashPassword(password: string): Promise<string> {
    const salt = await Bcrypt.genSalt(10);
    return await Bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return await Bcrypt.compare(password, hash);
}

export function generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET as string;
    const envExpiresIn = process.env.JWT_EXPIRES_IN as unknown as jwt.SignOptions['expiresIn'];
    const options: jwt.SignOptions = { expiresIn: envExpiresIn };
    return jwt.sign({ userId }, secret, options);
}
