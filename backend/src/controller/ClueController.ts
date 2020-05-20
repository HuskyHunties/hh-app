import { isNullOrUndefined } from "util";
import { Path, Place } from "./PathController";

/**
 * List of associated clues making up a crawl.
 */
export class Crawl {
  protected name: string;
  protected clues: Clue[];

  /**
   * GETTERS AND SETTERS
   */

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getClues(): Clue[] {
    return this.clues;
  }

  public setClues(clues: Clue[]): void {
    this.clues = clues;
  }
}

/**
 * Abstract representation of a clue image.
 */
export class Image {
  protected name: string;
  protected base64Encoding: string;

  constructor(base64Encoding: string){
    this.base64Encoding = base64Encoding;
  }
  /**
   * GETTERS AND SETTERS
   */

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getEncoding(): string{
    return this.base64Encoding;
  }
}

/**
 * Represents a single husky hunt clue, its location, and its associated metadata.
 */
export class Clue {
  constructor(
    protected name: string,
    protected place: Place,
    protected paths: Path[],
    protected finished: boolean,
    protected id: number,
    protected crawl?: Crawl,
    protected image?: Image
  ) {}

  /**
   * GETTERS AND SETTERS
   */

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getPlace(): Place {
    return this.place;
  }

  public setPlace(place: Place): void {
    this.place = place;
  }

  public hasCrawl(): boolean {
    return !isNullOrUndefined(this.crawl);
  }

  public getCrawl(): Crawl {
    if (!this.hasCrawl()) {
      throw new Error("no crawl");
    }
    return this.crawl;
  }

  public setCrawl(crawl: Crawl): void {
    this.crawl = crawl;
  }

  public getPaths(): Path[] {
    return this.paths;
  }

  public setPaths(paths: Path[]): void {
    this.paths = paths;
  }

  public getImage(): Image {
    return this.image;
  }

  public setImage(image: Image): void {
    this.image = image;
  }

  public isFinished(): boolean {
    return this.finished;
  }

  public setFinished(finished: boolean): void {
    this.finished = finished;
  }

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }
}

/**
 * Manages interactions with clues.
 */
export interface ClueController {
  /**
   * Add a new clue. returns the id of this new clue
   * @param name name of the clue
   * @param address address of the clue
   * @param assocCrawl crawl, if any, which contains this clue
   */
  addClue(name: string, place: Place, assocCrawl?: Crawl): number;

  /**
   * Finish a clue by submitting an image for points.
   * @param img an image taken at the clue location to store with this clue.
   * @param id ID of the completed clue.
   * returns the id of this clue
   */
  finishClue(img: Image, id: number): number;

  /**
   * Return a list of all clues ids, finished and unfinished.
   */
  getAllClues(): number[];

  /**
   * Return a list of all the ids of all unfinished clues.
   */
  unfinishedClues(): number[];

  /**
   * Return a list of all the ids of all finished clues.
   */
  finishedClues(): number[];

  /**
   * Delete a clue.
   * @param id ID of the clue to delete.
   */
  deleteClue(id: number): Clue;

  /**
   * Get the clue's image
   * @param id ID or the clue
   * @throws if the clue is incomplete or does not exist
   * @returns the Image
   */
  getImage(id: number): Image;
}

export class ClueControllerImp implements ClueController{
  addClue(name: string, place: Place, assocCrawl: Crawl): number {
    throw new Error("Method addClue not implemented.");
  }
  finishClue(img: Image, id: number): number {
    throw new Error("Method finishClue not implemented.");
  }
  getAllClues(): number[] {
    throw new Error("Method getAllClues not implemented.");
  }
  unfinishedClues(): number[] {
    throw new Error("Method unfinishedClues not implemented.");
  }
  finishedClues(): number[] {
    throw new Error("Method finishedClues not implemented.");
  }
  deleteClue(id: number): Clue {
    throw new Error("Method deleteClue not implemented.");
  }
  getImage(id: number): Image {
    throw new Error("Method getImage not implemented.");
  }
  
}