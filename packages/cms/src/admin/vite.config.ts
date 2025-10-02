import { mergeConfig } from "vite";
import path from "node:path";

module.exports = (config: any) => {
  return mergeConfig(config, {
    resolve: {
      alias: {
        "pruefungsupload-plugin": path.resolve(__dirname, "../../../pruefungsupload-plugin/admin/src"),
      },
    },
  });
};