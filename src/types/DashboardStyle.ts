export interface DashboardStyle {
    pinned: boolean;
    type: DashboardStyleType;
}

export enum DashboardStyleType {
    min = "min",
    max = "max"
}

