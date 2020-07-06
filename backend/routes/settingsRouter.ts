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

/**
 * Gets the setting objects
 * crawls: array of crawl names
 * colors: array of key value pairs for a crawl and a color
 */
settingsRouter.get("/", (req, res) => {
    if (!settings) {
        settings = defaults;
    }

    res.json({crawls: settings.crawls, colors: Array.from(settings.colors)});
});

/**
 * Add a new crawl to the list
 * 401: already a crawl
 */
settingsRouter.post("/crawl", (req, res) => {
    const newCrawl = req.body.newCrawl;
    if (settings.crawls.includes(newCrawl)) {
        res.status(401).send("Already a crawl")
    } else {
        settings.crawls.push(newCrawl);
        settings.colors.set(newCrawl, Icons.red);
        res.send({});
    }
});

/**
 * Delete a crawl from the list
 * 401: not a crawl
 */
settingsRouter.delete("/crawl/:name", (req, res) => {
    const crawl = req.params.name;
    console.log(crawl);
    if (!settings.crawls.includes(crawl)) {
        res.status(401).send("Not a crawl")
    } else {
        settings.crawls = settings.crawls.filter((crawlList) => crawlList != crawl);
        settings.colors.delete(crawl);
        res.send({});
        console.log(req.params);
    }
});

/**
 * Sets the new colors in the settings colors map
 */
settingsRouter.put("/crawl/colors", (req, res) => {
    const colors = new Map<string, Icons>(req.body.colors);
    colors.forEach((color, crawl) => {
        if (settings.crawls.includes(crawl)) {
            settings.colors.set(crawl, color);
        }
    })
    res.send({});
});



export default settingsRouter;