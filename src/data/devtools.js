import { allTools } from "./allTools";

export const devTools = allTools.filter((tool) => tool.category === "dev-tools");
