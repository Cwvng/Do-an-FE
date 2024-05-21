export interface SignupBody {
  firstname: string;
  lastname: string;
  email: string;
  mobile?: string;
  company?: string;
  birthday?: string;
}

export interface LoginBody {
  email: string;
  password: string;
}
export interface GoogleLoginBody {
  access_token: string;
}

export interface ChangePassword {
  oldPassword: string;
  newPassword: string;
}
export interface SendEmailResetBody {
  email: string;
}
export interface ResetPasswordBody {
  password: string;
}
