import * as express from "express";
import * as logger from "morgan";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as path from "path";

import groupsRouter from "../routes/groupsRouter";
import cluesRouter from "../routes/cluesRouter";
import pathsRouter from "../routes/pathsRouter";
import imagesRouter from "../routes/imagesRouter"
import settingsRouter from "../routes/settingsRouter";

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use(express.static(path.join(__dirname, "../../frontend/build")));
console.log(__dirname);

app.use("/groups", groupsRouter);
app.use("/clues", cluesRouter);
app.use("/paths", pathsRouter);
app.use("/images", imagesRouter)
app.use("/settings", settingsRouter);

export default app;
