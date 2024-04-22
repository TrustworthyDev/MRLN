import { DashboardStyle, DashboardStyleType } from "@/types/DashboardStyle";

import { defineStore } from 'pinia'

export const useDashboardStore = defineStore({
    id: 'dashboard',
    state: () => ({
        dashboardStyle: {
            pinned: false,
            type: DashboardStyleType.min
        } as DashboardStyle
    }),
    
    getters: {
        getDashboardStyle: (state) => state.dashboardStyle
    },

    actions: {
        setDashboardStyleType(payload: DashboardStyleType) {
            switch (payload) {
                case DashboardStyleType.max:
                    this.dashboardStyle.type = DashboardStyleType.max;
                    break;
                case DashboardStyleType.min:
                    this.dashboardStyle.type = DashboardStyleType.min;
                    break;
                default:
                    break;
            }
        },

        setDashboardPinned(payload: boolean) {
            this.dashboardStyle.pinned = payload;
        }
    }
})


