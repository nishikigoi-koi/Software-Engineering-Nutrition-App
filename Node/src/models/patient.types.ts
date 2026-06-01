export interface Patient {
    id: string | undefined;
    userId: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    ethnicity: string;
    weight: number;
    height: number;
    activityLevel: string;
}

export interface PatientDTO {
    userId: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    ethnicity: string;
    weight: number;
    height: number;
    activityLevel: string;
}