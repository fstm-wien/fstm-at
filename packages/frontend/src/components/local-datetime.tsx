import moment from "moment-timezone";
import "moment/locale/de";

export function LocalDatetime({ datetime: time, format }: { datetime: string; format: string }) {
    // TODO: for now we assume german locale and vienna time
    return <span>{moment(time).tz("Europe/Vienna").locale("de").format(format)}</span>;
}
