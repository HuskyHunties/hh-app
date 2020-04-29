import { Path } from "./PathController";

/**
 * A class to represent a group of people.
 */
export class Group {
    protected assocPath: Path;
    protected name: String;
    protected id: number;
}

/**
 * Manages the groups in the hunt.
 */
export interface GroupController {
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
     * @returns the path of the group
     */
    getGroupPath(groupID: number): Path;

    /**
     * Creates a new group with the given name and no associated path.
     * @param name the name of the new group
     */
    createGroup(name: String): Group;

    /**
     * Deletes the given group.
     * @param id the id of the group
     * @throws if the group with the id does not exist
     * @returns the group that was deleted
     */
    deleteGroup(id: number): Group;

    /**
     * Changes the group name to be the given name.
     * @param id the id of the group
     * @param newName the new name of the group
     */
    changeGroupName(id: number, newName: String): Group;
}