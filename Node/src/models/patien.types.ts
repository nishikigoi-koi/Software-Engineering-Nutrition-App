export interface Patient {
    id: string | undefined;
    userId: string;
    firstname: string;
    lastname: string;
    birthDate: string;
    gender: string;
    ethnicity: string;
    weight: number;
    height: number;
    activityLevel: string;
}

export interface PatientDTO {
    userId: string;
    firstname: string;
    lastname: string;
    birthDate: string;
    gender: string;
    ethnicity: string;
    weight: number;
    height: number;
    activityLevel: string;
}