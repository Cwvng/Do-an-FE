export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;

}

export interface UserAction {
    type: string;
    payload: Partial<User>;
}

export type UserState = User | null | undefined;
