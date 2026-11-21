import { PropsWithChildren } from "react";

import { AccordionShortcode } from "./accordion";
import { IconShortcode } from "./icon";
import { JournaldienstCalendarShortcode } from "./journaldienst-calendar";
import { PruefungssammlungShortcode } from "./pruefungssammlung";
import { Sparkly } from "./sparkly";
import { VerleihCalendarShortcode } from "./verleih-calendar";
import { VerleihObjekteShortcode } from "./verleih-items";

export const shortcodes: Record<string, React.FC<PropsWithChildren>> = {
    accordion: AccordionShortcode,
    journaldienst_calendar: JournaldienstCalendarShortcode,
    sparkly: Sparkly,
    icon: IconShortcode,
    pruefungssammlung: PruefungssammlungShortcode,
    verleihobjekte: VerleihObjekteShortcode,
    verleihtermine: VerleihCalendarShortcode,
};
