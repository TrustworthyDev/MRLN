import axios from "@/axios";
import {LoggingAction} from "@/types/logging/LoggingActions";
import {TableOptions} from "@/types/logging/TableOptions";

async function LogChanges(action: LoggingAction, table: TableOptions, contentId: number) {
    try {
        return await axios.post('/telemetry/all/', {
            action: action,
            table: table,
            content_id: contentId
        }, {withCredentials: true});
    } catch (e) {
        return e;
    }
}

interface LogEntry {
    action: LoggingAction;
    table: TableOptions;
    content_id: number;
}

async function BulkLogChanges(action: LoggingAction, table: TableOptions, contentId: number[]) {
    try {
        const allItems: Array<LogEntry> = [];
        contentId.forEach(i => {
            allItems.push({
                action: action,
                table: table,
                content_id: i
            } as LogEntry);
        });
        return await axios.post('/telemetry/bulk/', allItems, {withCredentials: true});
    } catch (e) {
        return e;
    }
}

async function GetLogChanges() {
    try {
        return await axios.get('/history/all', {withCredentials: true});
    } catch (e) {
        return e;
    }
}

export {
    LogChanges,
    GetLogChanges,
    BulkLogChanges
}
