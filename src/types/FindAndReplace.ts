export interface FindAndReplace {
    id: number;
    find_keyword: string;
    replace_keyword: string;
}

export interface FindAndReplaceRequest {
    id: number;
    find_keyword: string;
    replace_keyword: string;
    method_type: FindAndReplaceMethodType
}

export enum FindAndReplaceMethodType {
    delete = "delete",
    update = "update",
    create = "create"
}
