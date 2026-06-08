

export interface User {
    id: number | undefined;
    username: string;
    passwordHash: string;
}

export interface UserDTO {
    username: string;
    password: string;
}

export interface UserDatabaseObject{
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | undefined,
    username: string
}

export interface UserLogin{
    token: string,
    user: UserDatabaseObject
}