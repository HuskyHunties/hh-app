import { isNullOrUndefined } from "util";

/**
 * List of associated clues making up a crawl.
 */
export class Crawl {
  name: string;
  clues: Clue[];
}

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
}

/**
 * Abstract representation of a clue image.
 */
export class Image {
  name: string;
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
   * Add a new clue.
   * @param name name of the clue
   * @param address address of the clue
   * @param assocCrawl crawl, if any, which contains this clue
   */
  addClue(name: string, place: Place, assocCrawl: Crawl): void;

  /**
   * Finish a clue by submitting an image for points.
   * @param img an image taken at the clue location to store with this clue.
   * @param id ID of the completed clue.
   */
  finishClue(img: Image, id: number): void;

  /**
   * Return a list of all clues, finished and unfinished.
   */
  clues(): Clue[];

  /**
   * Return a list of all unfinished clues.
   */
  unfinishedClues(): Clue[];

  /**
   * Return a list of all finished clues.
   */
  finishedClues(): Clue[];

  /**
   * Delete a clue.
   * @param id ID of the clue to delete.
   */
  deleteClue(id: number): Clue;
<<<<<<< HEAD
}
=======
}
>>>>>>> 69fccd6384ef794fc2fc445d984e9c8cfb47d4d2
