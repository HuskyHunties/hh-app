import { Path } from "./PathController";

/**
 * A class to represent a group of people.
 */
export class Group {
  protected assocPath: Path;
  protected name: string;
  protected id: number;


  getName(): string{
    return this.name;
  }

  setName(name: string): void{
    this.name = name;
  }

  getPath(): Path{
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
  deleteGroup(id: number): Group;

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
    throw new Error("Method not implemented.");
  }

  setPath(pathID: number, groupID: number): void;
  setPath(pathID: number, groupID: number, override: boolean): void;

  setPath(pathID: any, groupID: any, override?: any) {
    throw new Error("Method not implemented.");
  }

  getGroupPath(groupID: number): number {
    throw new Error("Method not implemented.");
  }

  createGroup(name: string): number {
    throw new Error("Method not implemented.");
  }

  deleteGroup(id: number): Group {
    throw new Error("Method not implemented.");
  }

  changeGroupName(id: number, newName: string): number {
    throw new Error("Method not implemented.");
  }
}
