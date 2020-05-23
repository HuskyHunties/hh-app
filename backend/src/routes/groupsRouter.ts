/* eslint-disable tsdoc/syntax */
import * as express from "express";
import { dbWrapper } from "../database/DatabaseWrapper";

const groupsRouter: express.Router = express.Router();

/**
 * sends a response of all the group IDs in the database
 */
groupsRouter.get("/", async (req, res) => {
  try {
    const allGroupIDs = await dbWrapper.getAllGroups();

    res.send({ allGroups: allGroupIDs });
  } catch (error) {
    console.log(error);
    res.status(400).json();
  }
});

/**
 * sends an object with all the fields of the requested group in the database
 * { groupID: groupID, name: name, pathID: pathID }
 */
groupsRouter.get("/:groupID", async (req, res) => {
  try {
    const groupID = Number(req.params.groupID);

    const infoObject: object = await dbWrapper.getInfofGroup(groupID);

    res.send(infoObject);
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

/**
 * adds a group to the database, JSON with group name in request body,
 * sends information on the created group
 * { groupID: row.group_id, name: row.name }
 */

groupsRouter.post("/", async (req, res) => {
  try {
    const groupName = req.body.name;
    const infoObject: object = await dbWrapper.addGroup(groupName);

    res.send(infoObject);
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

/**
 * deletes the group specified by the given ID, sends information on deleted group
 * { name: name, pathID: pathID }
 */

groupsRouter.delete("/:groupID", async (req, res) => {
  try {
    const groupID = Number(req.params.groupID);
    const infoObject: object = await dbWrapper.deleteGroup(groupID);

    res.send(infoObject);
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

/**
 * changes either/or of the name/pathID fields of the specified group,
 * sends information on modified group
 * { groupID: groupID, name: name, pathID: pathID }
 */
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
    res.status(400).send();
    console.log(error);
  }
});
export default groupsRouter;
