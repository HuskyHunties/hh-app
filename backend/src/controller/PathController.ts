import { isNullOrUndefined } from "util";
import { Clue } from "./ClueController";

/**
 * Abstract representation of a real world location.
 */
export class Place {
  location: string;

  public getLocation(): string {
    return this.location;
  }
}

/**
 * Ordered list of clues for players to follow.
 */
export class Path {
  name: string;
  id: number;
  protected clues: Clue[];
  protected description?: string;

  /* determines whether this place has a description */
  public hasDescription(): boolean {
    return !isNullOrUndefined(this.description);
  }

  /* gets the description if it exists */
  public getDescription(): string {
    if (this.hasDescription()) {
      return this.description;
    }

    throw new Error("The Place does not currently have a description field.");
  }

  /* gets the clues in this path */
  public getClues(): Clue[] {
    return this.clues;
  }

  /* sets the clues of this object */
  public setClues(clues: Clue[]): void {
    this.clues = clues;
  }
}

/**
 * Manages interactions with Paths.
 */
export interface PathController {
  /**
   * Makes a new path from the list of clues, does not guarantee any specific order.
   * @param clues the clues IDs that will make up the path
   * @returns the id of the new path
   */
  newPath(clues: number[]): number;

  /**
   * Remove the specified path.
   * @param pathID the path to remove
   * @returns the ids of the clues that were in the deleted path
   */
  removePath(pathID: number): number[];

  /**
   * Gets the list of clues from the specified path
   * @param pathID the path to get clues from
   * @returns the list of ids of the clues on the path
   */
  getClues(pathID: number): number[];

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
   * @param pathID the path id
   * @param startingPoint the starting point
   */
  orderPath(pathID: number, startingPoint: Place): void;

  /**
   * Orders the path, from the starting point to the ending point to take the least total amount of distance. Note: this should only reorder incomplete clues.
   * @param pathID the path id
   * @param startingPoint the starting point
   * @param endingPoint the ending point
   */
  orderPath(pathID: number, startingPoint: Place, endingPoint: Place): void;

  /**
   * Gets a list of the clues along the path that have not yet been completed.
   * @param pathID the path id
   * @returns the list of incomplete clues ids
   */
  getIncompleteClues(pathID: number): number[];

  /**
   * Gets a list of the clues along the path that have been completed.
   * @param pathID the path id
   * @returns the list of complete clues ids
   */
  getCompleteClues(pathID: number): number[];
}

export class PathControllerImp implements PathController {
  newPath(clues: number[]): number {
    throw new Error("Method newPath not implemented.");
  }
  removePath(pathID: number): number[] {
    throw new Error("Method removePath not implemented.");
  }
  getClues(pathID: number): number[] {
    throw new Error("Method getClues not implemented.");
  }
  addClueToPath(pathID: number, clueID: number): void {
    throw new Error("Method addClueToPath not implemented.");
  }
  removeClueFromPath(pathID: number, clueID: number): Clue {
    throw new Error("Method removeClueFromPath not implemented.");
  }
  orderPath(pathID: number, startingPoint: Place): void;
  orderPath(pathID: number, startingPoint: Place, endingPoint: Place): void;
  orderPath(pathID: any, startingPoint: any, endingPoint?: any) {
    throw new Error("Method orderPath not implemented.");
  }
  getIncompleteClues(pathID: number): number[] {
    throw new Error("Method getIncompleteClues not implemented.");
  }
  getCompleteClues(pathID: number): number[] {
    throw new Error("Method getCompleteClues not implemented.");
  }
}
