import { Clue, Place } from "./ClueController";

/**
 * Ordered list of clues for players to follow.
 */
export class Path {
    protected name: String;
    protected clues: Clue[];
    protected id: number;
}

/**
 * Manages interactions with Paths.
 */
export interface PathController {
    /**
     * Makes a new path from the list of clues, does not guarantee any specific order.
     * @param clues the clues that will make up the path
     * @returns the new path
     */
    newPath(clues: Clue[]): Path;
    
    /**
     * Remove the specified path.
     * @param id the path to remove
     * @returns the removed path
     */
    removePath(id: number): Path;

    /**
     * Gets the list of clues from the specified path
     * @param id the path to get clues from
     * @returns the list of clues on the path
     */
    getClues(id: number): Clue[];

    /**
     * Adds an exisitng clue to an an exisiting path.
     * @param pathID The id of the path
     * @param clueID The id of the clue
     * @throws if the clue or path does not exist
     */
    addClueToPath(pathID: number, clueID: number): void;

    /**
     * Removes a clue from a path
     * @param pathID The id of the path
     * @param clueID The id of the clue
     * @throws if the clue is not a part of the path
     * @returns the removed clue
     */
    removeClueFromPath(pathID: number, clueID: number): Clue;

    /**
     * Orders the path, from the starting point to take the least total amount of distance.  Note: this should only reorder incomplete clues.
     * @param id the path id
     * @param startingPoint the starting point
     */
    orderPath(id: number, startingPoint: Place): void;

    /**
     * Orders the path, from the starting point to the ending point to take the least total amount of distance. Note: this should only reorder incomplete clues.
     * @param id the path id
     * @param startingPoint the starting point
     * @param endingPoint the ending point
     */
    orderPath(id: number, startingPoint: Place, endingPoint: Place): void;

    /**
     * Gets a list of the clues along the path that have not yet been completed.
     * @param id the path id
     * @returns the list of incomplete clues
     */
    getIncompleteClues(id: number): Clue[];

    /**
     * Gets a list of the clues along the path that have been completed.
     * @param id the path id
     * @returns the list of complete clues
     */
    getCompleteClues(id: number): Clue[];
}