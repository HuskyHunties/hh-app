/* eslint-disable tsdoc/syntax */
import * as express from "express";
import { dbWrapper } from "../public/DatabaseWrapper";

const groupsRouter: express.Router = express.Router();

/**
 * sends a response of all the group IDs in the database
 */
groupsRouter.get("/", (req, res) => {
  dbWrapper
    .getAllGroups()
    .then((allGroupIDs) => res.send({ allGroups: allGroupIDs }))
    .catch((error) => res.status(400).send(error));
});

/**
 * sends an object with all the fields of the requested group in the database
 * { groupID: groupID, name: name, pathID: pathID }
 */
groupsRouter.get("/:groupID", (req, res) => {
  const groupID = Number(req.params.groupID);
  dbWrapper
    .getInfofGroup(groupID)
    .then((infoObject) => res.send(infoObject))
    .catch((error) => res.status(400).send(error));
});

/**
 * adds a group to the database, JSON with group name in request body,
 * sends information on the created group
 */

groupsRouter.post("/", (req, res) => {
  const groupName = req.body.name;
  dbWrapper
    .addGroup(groupName)
    .then((infoObject) => res.send(infoObject))
    .catch(() => {
      res.status(400).send("Group of that name already exists");
    });
});

/**
 * deletes the group specified by the given ID, sends information on deleted group
 *
 */

groupsRouter.delete("/:groupID", (req, res) => {
  const groupID = Number(req.params.groupID);
  dbWrapper
    .deleteGroup(groupID)
    .then((infoObject) => res.send(infoObject))
    .catch((error) => res.status(400).send(error));
});

// removes the path assignment from ths specified group
groupsRouter.delete("/:groupID/path", (req, res) => {
  const groupID = Number(req.params.groupID);
  dbWrapper
    .setPathOfGroupTo(groupID, null)
    .then((infoObject) => res.send(infoObject))
    .catch((error) => res.status(400).send(error));
});

/**
 * changes either/or of the name/pathID fields of the specified group,
 * sends information on modified group
 */
groupsRouter.put("/:groupID", async (req, res) => {
  const groupID = Number(req.params.groupID);
  const newPathID = Number(req.body.pathID);
  const newName: string = req.body.name;

  if (newPathID) {
    const alreadyAssigned = await dbWrapper.isPathAssigned(newPathID);
    if (alreadyAssigned) {
      res.status(401).send("Path already assigned to a group");
    } else {
      dbWrapper
        .setPathOfGroupTo(groupID, newPathID)
        .then((infoObject) => res.send(infoObject))
        .catch((err) => {
          res.status(400).send(err);
        });
    }
  }

  if (newName) {
    dbWrapper.changeGroupName(groupID, newName).catch(() => {
      res.status(402).send("Group of that name already exists");
    });
  }
});

/**
 * changes the pathID of the specified group, regardless of whether the path has already been assigned,
 * sends information on modified group
 */
groupsRouter.put("/:groupID/override", async (req, res) => {
  const groupID = Number(req.params.groupID);
  const newPathID = Number(req.body.pathID);

  dbWrapper
    .setPathOfGroupTo(groupID, newPathID)
    .then((infoObject) => res.send(infoObject))
    .catch((err) => {
      res.status(400).send(err);
    });
});

export default groupsRouter;
