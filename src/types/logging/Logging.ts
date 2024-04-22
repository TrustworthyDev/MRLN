import {User} from "@/types/User";
import {LoggingAction} from "@/types/logging/LoggingActions";
import {TableOptions} from "@/types/logging/TableOptions";

export interface Logging {
    user: User | null;
    action: LoggingAction | null;
    timestamp: number; // Represented as a unix timestamp
    table: TableOptions | null;
    foreign_key: number | null;
}
