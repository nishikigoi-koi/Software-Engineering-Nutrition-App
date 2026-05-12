

export interface User {
    id: number | undefined;
    username: string;
    passwordHash: string;
}

export interface CreateUserDTO {
    username: string;
    passwordHash: string;
}
