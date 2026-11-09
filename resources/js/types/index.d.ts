
export interface User {
    id: number;
    name: string;
    first_name?: string | null;
    last_name?: string | null;
    email: string;
    email_verified_at?: string | null;
    student_number?: string | null;
    campus?: string | null;
    academic_level?: string | null;
    department?: string | null;
    role: 'researcher' | 'coordinator' | 'reviewer';
    is_active: boolean;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
