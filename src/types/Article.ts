import {ModelTypes} from "@/types/ModelTypes";

export interface Model {
    id: number;
    name: string;
}

export interface Agency {
    id: number;
    name: string;
}
export interface Rules {
    id: number;
    rule_name: string;
    applyFlag:boolean;
}

export interface Status {
    id: number;
    name: string;
}

export interface Sector {
    id: number;
    name: string;
}

export interface Tag {
    id: number;
    name: string;
}

export interface Classification {
    id: number;
    name: string;
}


export interface FederalRegisterPublication {
    id: number;
    name: string;
}

export interface FilingType {
    id: number;
    name: string;
}

export interface AlertType {
    id: number;
    name: string;
}

export interface UpdateArticlesWithModels {
    articles: Array<Article>;
    models: Array<Model> | Model;
    type: ModelTypes;
    required: boolean;
    many: any;
}

export interface Article {
    id: number;
    sector: Sector;
    title?: string;
    summary?: string;
    agency?: Array<Agency>;
    url: string;
    status?: Status;
    tags?: Array<string>;
    classification: Classification;
    federal_register_publication: FederalRegisterPublication;
    federal_register_number?: string;
    proposed_rule_comments_due_date?: Date | null;
    original_publication_date: Date;
    federal_register_publication_date?: Date | null;
    rule_effective_date?: Date | null;
    latest_update: Date | string;
    filing_type: FilingType;
    alert_type: AlertType;
    sec_release_number?: string;
    order_notice_id?: string;
    docket_file_number?: string;
    fine_amount_total?: number;
    event_start_date?: Date | null;
    event_end_date?: Date | null;
    event_location?: string;
    regalytics_alert_id: string;
    selected: boolean;
}
