import { errors } from "@strapi/utils";
import moment from "moment";

const { ApplicationError } = errors;

export default {
    async beforeCreate(event) {
        const { data } = event.params;

        const matriculationNr: number | undefined = data?.matriculationNr;
        const folder: string | undefined = data?.folder;

        if (!matriculationNr) {
            throw new ApplicationError("matriculationNr is required", { status: 400 });
        }
        if (!folder) {
            throw new ApplicationError("folder is required", { status: 400 });
        }

        const oneMonthAgo = moment().utc().subtract(1, "month");
        const oneMonthAgoIso = oneMonthAgo.toISOString();

        const alreadyRequestedFolder = await strapi.db.query("api::pruefungsanfrage.pruefungsanfrage").count({
            where: {
                matriculationNr,
                folder,
                createdAt: { $gte: oneMonthAgoIso },
            },
        });

        if (alreadyRequestedFolder > 0) {
            await strapi.db.query("api::pruefungsanfrage.pruefungsanfrage").deleteMany({
                where: {
                    matriculationNr,
                    folder,
                    createdAt: { $gte: oneMonthAgoIso },
                },
            });

            return;
        }

        const rows = await strapi.db.query("api::pruefungsanfrage.pruefungsanfrage").findMany({
            where: {
                matriculationNr,
                createdAt: { $gte: oneMonthAgoIso },
            },
            select: ["folder"],
        });

        const limit = 5;
        const distinct = new Set<string>(rows.map((r) => r.folder).filter(Boolean));
        if (distinct.size >= limit) {
            throw new ApplicationError(`Monthly limit reached: max ${limit} distinct folder`, { status: 429 });
        }
    },
};
