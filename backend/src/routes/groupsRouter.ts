import * as express from "express";
import { GroupControllerImpError } from "../controller/GroupController";
import { dbWrapper } from "../controller/Database";

const groupsRouter: express.Router = express.Router();
const controller = new GroupControllerImpError();

// gets all the groups in the database
groupsRouter.get("/", async (req, res, next) => {
  try {
    const allGroups = await dbWrapper.getAllGroups();

    res.send({ allGroups: allGroups });
  } catch (error) {
    console.log(error);
    res.status(400).json({ allGroups: [1, 2, 3] });
  }
});

// sends the id of the path of a specific group in the database based off the given ID
groupsRouter.get("/:groupID", async (req, res, next) => {
  try {
    const groupID = Number(req.params.groupID);

    const pathID: number = await dbWrapper.getPathOfGroup(groupID);

    res.send({ pathID: pathID });
  } catch (error) {
    console.log(error);
    res.status(400).send({ pathID: 45 });
  }
});

// adds a group to the database, JSON with group name in request body
groupsRouter.post("/", async (req, res, next) => {
  try {
    const groupName = req.body.name;
    const groupID = await dbWrapper.createGroup(groupName);

    res.send({ groupID: groupID });
  } catch (error) {
    console.log(error);
    res.status(400).send({ groupID: 23 });
  }
});

// deletes the group specified by the given ID
groupsRouter.delete("/:groupID", async (req, res, next) => {
  try {
    const groupID = Number(req.params.groupID);
    const deletedPathID = await dbWrapper.deleteGroup(groupID);

    res.send({
      pathID: deletedPathID,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      pathID: 4,
    });
  }
});

// sets the path of the specific group to the pathID given in the body,
// also in the request body is whether or not to override the path assignment
groupsRouter.put("/:groupID/path", (req, res, next) => {
  try {
    const groupID = Number(req.params.groupID);
    const pathID = Number(req.body.pathID);

    if (req.body.override) {
      dbWrapper.setPathOfGroupTo(groupID, pathID, true);
    } else {
      try {
        dbWrapper.setPathOfGroupTo(groupID, pathID);
      } catch (error) {
        res.status(400).send(error);
      }
    }

    const responseObj = { pathID: pathID, groupID: groupID };
    res.json(responseObj);
  } catch (error) {
    console.log(error);
    res.status(400).send({ pathID: 31, groupID: 26 });
  }
});

// changes the group name of the group specified by the ID, name in request body
groupsRouter.put("/:groupID/name", (req, res, next) => {
  const groupID = Number(req.params.groupID);
  const newName = req.body.name;
  try {
    dbWrapper.changeGroupName(groupID, newName);
    const responseObj = { groupID: groupID, name: newName };
    res.json(responseObj);
  } catch (error) {
    res.status(400).send({ groupID: 1 });
    console.log(error);
  }
});

export default groupsRouter;
