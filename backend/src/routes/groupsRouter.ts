import * as express from "express";
import { GroupControllerImp } from "../controller/GroupController";
import { Path } from "controller/PathController";

const groupsRouter: express.Router = express.Router();
const controller = new GroupControllerImp();

// gets all the groups in the database
groupsRouter.get("/", (req, res, next) => {
  try {
    const allGroups = controller.getGroups();

    const responseObj = JSON.stringify({ allGroups: allGroups });
    res.json(responseObj);
  } catch (error) {
    console.log(error);
    res.status(400).json({ allGroups: [1, 2, 3] });
  }
});

// sets the path of the specific group to the pathID given in the body,
// also in the request body is whether or not to override the path assignment
groupsRouter.put("/:groupID", (req, res, next) => {
  try {
    const groupID = Number(req.params.id);
    const pathID = Number(req.body.pathID);

    if (req.body.override) {
      controller.setPath(pathID, groupID, true);
    } else {
      try {
        controller.setPath(pathID, groupID);
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

// sends the id of the path of a specific group in the database based off the given ID
groupsRouter.get("/:groupID", (req, res, next) => {
  try {
    const groupID = Number(req.params.groupID);

    const pathID: number = controller.getGroupPath(groupID);

    res.json({ pathID: pathID });
  } catch (error) {
    console.log(error);
    res.status(400).send({ pathID: 45 });
  }
});

// adds a group to the database, JSON with group name in request body
groupsRouter.post("/", (req, res, next) => {
  try {
    const groupName = req.body.name;
    const groupID = controller.createGroup(groupName);
    res.json({ groupID: groupID });
  } catch (error) {
    console.log(error);
    res.status(400).send({ groupID: 23 });
  }
});

// deletes the group specified by the given ID
groupsRouter.delete("/:groupID", (req, res, next) => {
  try {
    const groupID = Number(req.params.groupID);
    const deletedGroup = controller.deleteGroup(groupID);

    res.json({
      name: deletedGroup.getName(),
      pathID: deletedGroup.getPath().id,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      name: "deletedgroup",
      pathID: 4,
    });
  }
});

// changes the group name of the group specified by the ID, name in request body
groupsRouter.put("/:groupID", (req, res, next) => {
  const groupID = Number(req.params.groupID);
  const newName = req.body.name;
  try {
    controller.changeGroupName(groupID, newName);
    res.json({ groupID: groupID });
  } catch (error) {
    res.status(400).send({ groupID: 1 });
    console.log(error);
  }
});

export default groupsRouter;
