export interface DeleteTypes {
    id: number;
    type: RequestType;
    name: string;
    model: ModelTypes;
}

export interface UpdateModel {
    id: number;
    name: string;
    model: string;
}

export interface Model {
    id: number;
    name: string;
}

export enum ModelTypes {
    agency = "agency",
    sector = "sector",
    status = "status",
    tag = "tag",
    classification = "classification",
    federal_register_publication = "federal_register_publication",
    filing_type = "filing_type",
    alert_type = "alert_type"
}

export enum RequestType {
    delete = "delete",
    update = "update"
}
