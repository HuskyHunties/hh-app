import * as express from "express";
import { Icons } from "../utils/icons"

export interface Settings {
    crawls: string[];
    colors: Map<string, Icons>;
}

const defaultColors = new Map();
defaultColors.set("U", Icons.lightblue);
defaultColors.set("V", Icons.yellow);
defaultColors.set("W", Icons.purple);
defaultColors.set("X", Icons.orange);
defaultColors.set("Y", Icons.blue);
defaultColors.set("Z", Icons.green);

const defaults: Settings = {
    crawls: ["U", "V", "W", "X", "Y", "Z"],
    colors: defaultColors
}

const settingsRouter: express.Router = express.Router();

let settings: Settings;

settingsRouter.get("/", (req, res) => {
    if (!settings) {
        settings = defaults;
    }

    res.json({crawls: settings.crawls, colors: Array.from(settings.colors)});
});

settingsRouter.put("/", (req, res) => {
    // TODO make this much better at error handling
    settings = req.params as unknown as Settings;
    res.send({});
});



export default settingsRouter;