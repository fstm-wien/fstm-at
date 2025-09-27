import type { Core } from "@strapi/strapi";
import moment from "moment";

export default {
    register() {},
    bootstrap({ strapi }: { strapi: Core.Strapi }) {
        strapi.cron.add({
            "monthly-pruefungsanfrage-prune": {
                task: async () => {
                    const oneMonthAgo = moment().utc().subtract(1, "month");
                    const oneMonthAgoIso = oneMonthAgo.toISOString();

                    await strapi.db.query("api::pruefungsanfrage.pruefungsanfrage").deleteMany({
                        where: { createdAt: { $lt: oneMonthAgoIso } },
                    });
                },
                options: { rule: "30 2 * * *" }, // run daily at 02:30
            },
        });
    },
};
