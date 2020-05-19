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

export class PathControllerImp implements PathController{
  newPath(clues: Clue[]): Path {
    throw new Error("Method newPath not implemented.");
  }
  removePath(id: number): Path {
    throw new Error("Method removePath not implemented.");
  }
  getClues(id: number): Clue[] {
    throw new Error("Method getClues not implemented.");
  }
  addClueToPath(pathID: number, clueID: number): void {
    throw new Error("Method addClueToPath not implemented.");
  }
  removeClueFromPath(pathID: number, clueID: number): Clue {
    throw new Error("Method removeClueFromPath not implemented.");
  }
  orderPath(id: number, startingPoint: Place): void;
  orderPath(id: number, startingPoint: Place, endingPoint: Place): void;
  orderPath(id: any, startingPoint: any, endingPoint?: any) {
    throw new Error("Method orderPath not implemented.");
  }
  getIncompleteClues(id: number): Clue[] {
    throw new Error("Method getIncompleteClues not implemented.");
  }
  getCompleteClues(id: number): Clue[] {
    throw new Error("Method getCompleteClues not implemented.");
  }
  
}
