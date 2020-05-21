import { Path } from "./PathController";
import { dbWrapper } from "./Database";

/**
 * A class to represent a group of people.
 */
export class Group {
  protected assocPath: Path;
  protected name: string;
  protected id: number;

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  getPath(): Path {
    return this.assocPath;
  }
}

/**
 * Manages the groups in the hunt.
 */
export interface GroupController {
  /**
   * Returns a list of all the ids of the groups in the database
   *
   *
   */
  getGroups(): number[];

  /**
   * Sets the path of the given group.
   * @param pathID the id of the path.
   * @param groupID the id of the group.
   * @throws if the path id is already claimed by another group.
   */
  setPath(pathID: number, groupID: number): void;

  /**
   * Sets the path of the given group.
   * @param pathID the id of the path
   * @param groupID the id of the group
   * @param override whether the path should be set even if the path is already claimed.
   * @throws if the path is already claimed and override is false
   */
  setPath(pathID: number, groupID: number, override: boolean): void;

  /**
   * Gets the path associated with the given group.
   * @param groupID the id of the group
   * @throws if the group id does not exist or there is no path associated with the group.
   * @returns the id of the path of the group
   */
  getGroupPath(groupID: number): number;

  /**
   * Creates a new group with the given name and no associated path.
   * @param name the name of the new group
   * returns the id of the created group
   */
  createGroup(name: string): number;

  /**
   * Deletes the given group.
   * @param id the id of the group
   * @throws if the group with the id does not exist
   * @returns the id group that was deleted
   */
  deleteGroup(id: number): number;

  /**
   * Changes the group name to be the given name.
   * @param id the id of the group
   * @param newName the new name of the group
   * returns the id of the group that was changed
   */
  changeGroupName(id: number, newName: string): number;
}

export class GroupControllerImp implements GroupController {
  getGroups(): number[] {
    return dbWrapper.getAllGroups();
  }
  setPath(pathID: number, groupID: number): void;
  setPath(pathID: number, groupID: number, override: boolean): void;
  setPath(pathID: any, groupID: any, override?: any) {
    return dbWrapper.setPathOfGroupTo(groupID, pathID);
    // need to implement overriding
  }
  getGroupPath(groupID: number): number {
    return dbWrapper.getPathOfGroup(groupID);
  }
  createGroup(name: string): number {
    return dbWrapper.createGroup(name);
  }
  deleteGroup(groupID: number): number {
    return dbWrapper.deleteGroup(groupID);
  }
  changeGroupName(groupID: number, newName: string): number {
    return dbWrapper.changeGroupName(groupID, newName);
  }
}
export class GroupControllerImpError implements GroupController {
  getGroups(): number[] {
    throw new Error("Method getGroups not implemented.");
  }

  setPath(pathID: number, groupID: number): void;
  setPath(pathID: number, groupID: number, override: boolean): void;

  setPath(pathID: any, groupID: any, override?: any) {
    throw new Error("Method setPath not implemented.");
  }

  getGroupPath(groupID: number): number {
    throw new Error("Method getGroupPath not implemented.");
  }

  createGroup(name: string): number {
    throw new Error("Method createGroup not implemented.");
  }

  deleteGroup(id: number): number {
    throw new Error("Method deleteGroup not implemented.");
  }

  changeGroupName(id: number, newName: string): number {
    throw new Error("Method changeGroupName not implemented.");
  }
}
