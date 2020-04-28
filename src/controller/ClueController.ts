
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
export class Address {
    name: string;
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
        protected address: Address,
        protected assocPaths: Path[],
        protected assocImage: Image,
        protected finished: boolean,
        protected id: number,
        protected assocCrawl?:  Crawl,
    ) {}

    /**
     * === GETTERS AND SETTERS ===
     */

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getAddress(): Address {
        return this.address;
    }

    public setAddress(address: Address): void {
        this.address = address;
    }

    public getAssocCrawl(): Crawl {
        return this.assocCrawl;
    }

    public setAssocCrawl(assocCrawl: Crawl): void {
        this.assocCrawl = assocCrawl;
    }

    public getAssocPaths(): Path[] {
        return this.assocPaths;
    }

    public setAssocPaths(assocPaths: Path[]): void {
        this.assocPaths = assocPaths;
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
    addClue(name: string, address: Address, assocCrawl: Crawl): void;

    /**
     * Finish a clue by submitting an image for points.
     * @param img an image taken at the clue location to store with this clue.
     * @param id ID of the completed clue.
     */
    finishClue(img: Image, id: number): void;

    /**
     * Return a list of all clues, finished and unfinished.
     */
    getClues(): Clue[];
    
    /**
     * Return a list of all unfinished clues.
     */
    getUnfinishedClues(): Clue[];

    /**
     * Return a list of all finished clues.
     */
    getFinishedClues(): Clue[];

    /**
     * Delete a clue.
     * @param id ID of the clue to delete.
     */
    deleteClue(id: number): Clue;

}

/**
 * Manages interactions with clues.
 */
export class ClueController {
    
    /**
     * Add a new clue. 
     * @param name name of the clue
     * @param address address of the clue
     * @param assocCrawl crawl, if any, which contains this clue
     */
    addClue(name: string, address: Address, assocCrawl: Crawl): void {
    }

    /**
     * Finish a clue by submitting an image for points.
     * @param img an image taken at the clue location to store with this clue.
     * @param id ID of the completed clue.
     */
    finishClue(img: Image, id: number): void;

    /**
     * Return a list of all clues, finished and unfinished.
     */
    getClues(): Clue[];
    
    /**
     * Return a list of all unfinished clues.
     */
    getUnfinishedClues(): Clue[];

    /**
     * Return a list of all finished clues.
     */
    getFinishedClues(): Clue[];

    /**
     * Delete a clue.
     * @param id ID of the clue to delete.
     */
    deleteClue(id: number): Clue;

}
