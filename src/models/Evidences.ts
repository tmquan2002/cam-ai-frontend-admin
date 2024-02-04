export interface EvidenceType {
    timestamp: string;
    id: number;
    name: string;
    description: string;
}

export interface Evidence {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    uri: string;
    evidenceTypeId: number;
    evidenceType: EvidenceType;
};