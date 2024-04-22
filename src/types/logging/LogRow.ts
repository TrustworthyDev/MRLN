import { UserResponse } from "@/types/User";
import { LoggingAction } from "@/types/logging/LoggingActions";
import { TableOptions } from "@/types/logging/TableOptions";

export interface LogRow {
    id: number;
    user: UserResponse;
    timestamp: string;
    action: LoggingAction;
    table: TableOptions;
    object_id: number | null;
    // eslint-disable-next-line @typescript-eslint/ban-types
    content_object: Object | null;
}
