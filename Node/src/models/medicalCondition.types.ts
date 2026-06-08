export interface medicalCondition {
    id: string;
    name: string;
    description: string;
}

export interface medicalConditionDTO {
    name: string;
    description: string;
}

export interface patientCondition {
    patientId: string,
    medicalConditionId: string
}