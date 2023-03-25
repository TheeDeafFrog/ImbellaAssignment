export enum IdType {
    path,
    uid,
    uuid,
}

export interface ComponentIdentification {
    id: string;
    idType: IdType;
}
