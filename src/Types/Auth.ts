
/* Login FormData */
export interface LoginFormData {
    email: string;
    password: string;
}


/* Register FormData */
export interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    profilePhoto?: string;
}

/* Update Profile FormData */
export interface UpdateProfileFormData {
    username: string;
    oldPassword?: string;
    newPassword?: string;
    profilePhoto?: string;
}

