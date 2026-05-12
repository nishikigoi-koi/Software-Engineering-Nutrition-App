import Bcrypt from 'bcrypt';


export async function hashPassword(password: string): Promise<string> {
    const salt = await Bcrypt.genSalt(10);
    return await Bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return await Bcrypt.compare(password, hash);
}
