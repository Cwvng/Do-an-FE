export interface SignupBody {
    firstName: string;
    lastName: string;
    email: string;
    mobile?: string;
    company?: string;
    birthday?: string;
}

export interface LoginBody {
    email: string;
    password: string;
}

export interface ChangePassword {
    oldPassword: string;
    newPassword: string;
}
