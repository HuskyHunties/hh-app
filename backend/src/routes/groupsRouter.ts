import * as express from "express";
import { dbWrapper } from "../controller/Database";

const groupsRouter: express.Router = express.Router();

// gets all the groups in the database
groupsRouter.get("/", async (req, res) => {
  try {
    const allGroups = await dbWrapper.getAllGroups();

    res.send({ allGroups: allGroups });
  } catch (error) {
    console.log(error);
    res.status(400).json({ allGroups: [1, 2, 3] });
  }
});

// sends the name and the id of the path of a specific group in the database based off the given ID
groupsRouter.get("/:groupID", async (req, res) => {
  try {
    const groupID = Number(req.params.groupID);

    const infoObject: object = await dbWrapper.getInfofGroup(groupID);

    res.send(infoObject);
  } catch (error) {
    console.log(error);
    res.status(400).send({ pathID: 45 });
  }
});

// adds a group to the database, JSON with group name in request body
groupsRouter.post("/", async (req, res) => {
  try {
    const groupName = req.body.name;
    const infoObject: object = await dbWrapper.createGroup(groupName);

    res.send(infoObject);
  } catch (error) {
    console.log(error);
    res.status(400).send({ groupID: 23 });
  }
});

// deletes the group specified by the given ID
groupsRouter.delete("/:groupID", async (req, res) => {
  try {
    const groupID = Number(req.params.groupID);
    const infoObject: object = await dbWrapper.deleteGroup(groupID);

    res.send(infoObject);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      pathID: 4,
    });
  }
});

// changes either/or of the name/pathID fields of the specified group
groupsRouter.put("/:groupID", async (req, res) => {
  const groupID = Number(req.params.groupID);
  const newPathID = Number(req.body.pathID);
  const newName: string = req.body.name;

  try {
    if (newPathID) {
      dbWrapper.setPathOfGroupTo(groupID, newPathID);
    }

    if (newName) {
      dbWrapper.changeGroupName(groupID, newName);
    }

    const infoObject: object = await dbWrapper.getInfofGroup(groupID);
    res.send(infoObject);
  } catch (error) {
    res.status(400).send({ groupID: req.params.groupID });
    console.log(error);
  }
});
export default groupsRouter;
