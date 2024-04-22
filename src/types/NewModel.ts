import { ModelTypes } from "@/types/ModelTypes";

export interface NewModel {
    name: string;
    model: ModelTypes;
}

export interface NewModelResponse {
    id: number;
    name: string;
    model: ModelTypes;
}
