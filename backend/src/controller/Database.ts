import * as fs from "fs";
import * as sqlite3 from "sqlite3";
import { isNullOrUndefined } from "util";

/**
 * Wrapper class for the database to provide various ways to interact with it
 */
export class DatabaseWrapper {
  protected db: sqlite3.Database;

  /**
   * Initializes the database by opening the file and running the initialization script
   * @param name name is either the path (including ./) or the string ":memory:"
   * if the database should be created in memory
   */
  constructor(name: string) {
    // initialize the database field by opening the database file
    this.db = new sqlite3.Database(name, (err) => {
      if (err) {
        throw console.error(err.message);
      }
      console.log("Connected to the in-memory SQlite database.");

      // run the initialization script on the database
      this.db.run(fs.readFileSync("./initDB.sql", "utf8"), (err) => {
        if (err) {
          throw console.error(err.message);
        }
        console.log("Successfully initialized the database.");
      });
    });
  }

  /**
   * Close the database connection, returning whether it was successfully closed
   */
  public close(): void {
    this.db.close((err) => {
      if (err) {
        return false;
      }
      console.log("Close the database connection.");
      return true;
    });
  }

  // CLUE TABLE METHODS

  /**
   *
   * @param name
   * @param place
   * @param crawlId
   */
  addClue(name: string, place: string, crawlId?: number): number {
    // if the clue has a crawl, add its crawl to the database; else, only add the clue
    if (!isNullOrUndefined(crawlId)) {
      this.db.run(
        "INSERT INTO clues(crawl_id, name, address, finished) VALUES(?)",
        [crawlId, name, place, 0],
        (err) => {
          if (err) throw console.error(err.message);
        }
      );
    } else {
      this.db.run(
        "INSERT INTO clues(name, address, finished) VALUES(?)",
        [name, place, 0],
        (err) => {
          if (err) throw console.error(err.message);
        }
      );
    }

    // retrieve the clue ID registered from the database
    let clueId: number;
    this.db.get(
      `SELECT clue_id FROM clues WHERE name = ${name}`,
      (err, row) => {
        if (err) {
          throw console.error(err.message);
        } else if (isNullOrUndefined(row)) {
          throw new Error("did not insert desired clue");
        }
        clueId = row.clue_id;
      }
    );

    return clueId;
  }

  /**
   *
   * @param clueID
   * @param pictureEncoding
   */
  addPictureToClue(clueID: number, pictureEncoding: string): number {
    // can we assume that this method will only be called with the names
    // of clues which we know to have beena added, and don't have to check for a clue?

    this.db.run(
      `UPDATE clues SET image = ${pictureEncoding} where clue_id = ${clueID}`,
      (err) => {
        if (err) throw console.error(err.message);
      }
    );

    return clueID;
  }

  /**
   *
   * @param clueID
   */
  completeClue(clueID: number): number {
    this.db.run(
      `UPDATE clues SET finished = 1 where clue_id = ${clueID}`,
      (err) => {
        if (err) {
          throw console.error(err.message);
        }
      }
    );

    return clueID;
  }

  /**
   *
   * @param clueID
   */
  deleteClue(clueID: number): void {
    this.db.run(`DELETE FROM clues WHERE clue_id = ${clueID}`, (err) => {
      if (err) {
        throw console.error(err.message);
      }
    });
  }

  /**
   * @returns an array of all the clue_ids in the clues table of the database
   */
  getAllClueIDs(): number[] {
    const allClueIDs: number[] = [];

    this.db.all(`SELECT clue_id FROM clues`, [], (err, rows) => {
      if (err) {
        throw console.error(err.message);
      }
      rows.forEach((row) => {
        allClueIDs.push(row.clue_id);
      });
    });
    return allClueIDs;
  }
  /**
   *  @returns an array of all the clue_ids of the unfinished clues in the clues table of the database
   */
  getAllUnfinishedClueIDs(): number[] {
    const allUnfinishedClueIDs: number[] = [];

    this.db.each(
      `SELECT clue_id FROM clues where finished = 0`,
      [],
      (err, rows) => {
        if (err) {
          throw console.error(err.message);
        }
        rows.forEach((row) => {
          allUnfinishedClueIDs.push(row.clue_id);
        });
      }
    );
    return allUnfinishedClueIDs;
  }

  /**
   *  @returns an array of all the clue_ids of the finished clues in the clues table of the database
   */
  getAllFinishedClueIDs(): number[] {
    const AllFinishedClueIDs: number[] = [];

    this.db.each(
      `SELECT clue_id FROM clues where finished = 0`,
      [],
      (err, rows) => {
        if (err) {
          throw console.error(err.message);
        }
        rows.forEach((row) => {
          AllFinishedClueIDs.push(row.clue_id);
        });
      }
    );
    return AllFinishedClueIDs;
  }

  getImageStringOfClue(clueID: number): string {
    let imageString: string;

    this.db.get(
      `SELECT image FROM clues WHERE clue_id = ${clueID}`,
      (err, row) => {
        if (err) {
          throw console.error(err.message);
        } else if (isNullOrUndefined(row)) {
          throw new Error("desired clue was not selected");
        }
        imageString = row.image;
      }
    );

    return imageString;
  }

  // Group Controller Methods

  /**
   *
   * @param name
   * returns the id of the created group
   */
  addGroup(name: string): number {
    this.db.run("INSERT INTO groups(name) VALUES(?)", [name], (err) => {
      if (err) throw console.error(err.message);
    });

    let groupID: number;

    this.db.get(
      `SELECT group_id from groups WHERE name = ${name}`,
      (err, row) => {
        if (err) {
          throw console.error(err.message);
        }
        groupID = row.group_id;
      }
    );

    return groupID;
  }

  /**
   *
   * @param groupID
   * returns the ID of the path this group had
   */
  deleteGroup(groupID: number): number {
    let pathID: number;

    this.db.run(
      `DELETE FROM groups WHERE group_id = ${groupID}`,
      (err, row) => {
        if (err) {
          throw console.error(err.message);
        }

        pathID = row.path_id;
      }
    );

    return pathID;
  }

  /**
   * returns an array of all the group ids in the groups table
   */
  getAllGroups(): number[] {
    const allGroupIDs: number[] = [];

    this.db.all(`SELECT group_id FROM groups`, [], (err, rows) => {
      if (err) {
        throw console.error(err.message);
      }
      rows.forEach((row) => {
        allGroupIDs.push(row.group_id);
      });
    });
    return allGroupIDs;
  }

  /**
   *
   * @param groupID
   * @param pathID
   * sets the path_id of the specified group to the specified path
   */
  setPathOfGroupTo(groupID: number, pathID: number): void {
    this.db.run(
      `UPDATE groups SET path_id = ${pathID} where group_id = ${groupID}`,
      (err) => {
        if (err) {
          throw console.error(err.message);
        }
      }
    );
  }

  /**
   *
   * @param groupID
   * returns the id of the path of the specified group
   */
  getPathOfGroup(groupID: number): number {
    let pathID: number;
    this.db.get(
      `SELECT path_id from groups WHERE group_id = ${groupID}`,
      (err, row) => {
        if (err) {
          throw console.error(err.message);
        }
        pathID = row.path_id;
      }
    );

    return pathID;
  }

  /**
   *
   * @param groupID
   * @param newName
   * returns the given group id that is being modified
   */
  changeGroupName(groupID: number, newName: string): number {
    this.db.run(
      `UPDATE groups SET name = ${newName} WHERE group_id = ${groupID}`,
      (err) => {
        if (err) {
          throw console.error(err.message);
        }
      }
    );
    return groupID;
  }

  // PATH CONTROLLER METHODS - path and join tables

  /**
   *
   * @param clueIDs
   * returns the id of the created path
   */
  createPath(name: string, clueIDs: number[]): number {
    this.db.run(`INSERT INTO paths(name) VALUES(?)`, [name], (err) => {
      if (err) throw console.error(err.message);
    });

    let pathID: number;

    this.db.get(
      `SELECT path_id from paths WHERE name = ${name}`,
      (err, row) => {
        if (err) {
          throw console.error(err.message);
        }
        pathID = row.path_id;
      }
    );

    clueIDs.forEach((clueID) => {
      this.db.run(
        `INSERT INTO paths_join_clues(path_id, clue_id) VALUES(?)`,
        [pathID, clueID],
        (err) => {
          if (err) {
            throw console.error(err.message);
          }
        }
      );
    });

    return pathID;
  }

  /**
   *
   * @param pathID
   * returns an array of the clueIDs which were on this path
   */
  removePath(pathID: number): number[] {
    const clueIDs: number[] = [];

    // collecting the clue ids from the join table
    this.db.each(
      `SELECT clue_id FROM paths_join_clues WHERE path_id = ${pathID}`,
      (err, rows) => {
        if (err) {
          throw console.error(err.message);
        }

        rows.forEach((row) => {
          clueIDs.push(row.clue_id);
        });
      }
    );

    //deleting the path from the path table
    this.db.run(`DELETE FROM paths WHERE path_id = ${pathID}`, (err) => {
      if (err) {
        throw console.error(err.message);
      }
    });

    return clueIDs;
  }

  /**
   *
   * @param pathID
   * returns all the clue IDs associated with the specific clue
   */
  getCluesofPath(pathID: number): number[] {
    const clueIDs: number[] = [];

    // collecting the clue ids from the join table
    this.db.each(
      `SELECT clue_id FROM paths_join_clues WHERE path_id = ${pathID}`,
      (err, rows) => {
        if (err) {
          throw console.error(err.message);
        }

        rows.forEach((row) => {
          clueIDs.push(row.clue_id);
        });
      }
    );

    return clueIDs;
  }

  /**
   * adds the specified clue to the specified path in the join table
   * @param pathID
   * @param clueID
   */
  addClueToPath(pathID: number, clueID: number): void {
    this.db.run(
      `INSERT INTO paths_join_clues(path_id, clue_id) VALUES(?)`,
      [pathID, clueID],
      (err) => {
        if (err) {
          throw console.error(err.message);
        }
      }
    );
  }

  /**
   * removes the specified clue from the specified path
   * @param pathID
   * @param clueID
   * returns the clueID removed
   */
  removeClueFromPath(pathID: number, clueID: number): number {
    this.db.run(
      `DELETE FROM paths_join_clues WHERE path_id = ${pathID} AND clue_id = ${clueID}`,
      (err) => {
        if (err) {
          throw console.error(err.message);
        }
      }
    );

    return clueID;
  }

  /**
   *  @returns an array of all the clue_ids of the unfinished clues in the clues table of the database
   */
  getAllUnfinishedClueIDsOfPath(pathID: number): number[] {
    const allClues = this.getCluesofPath(pathID);
    const allUnfinishedClueIDs: number[] = [];

    allClues.forEach((clueID) => {
      this.db.each(
        `SELECT finished FROM clues WHERE clue_id = ${clueID}`,
        [],
        (err, rows) => {
          if (err) {
            throw console.error(err.message);
          }
          rows.forEach((row) => {
            if (row.finished === 0) {
              allUnfinishedClueIDs.push(row.clue_id);
            }
          });
        }
      );
    });

    return allUnfinishedClueIDs;
  }

  /**
   *  @returns an array of all the clue_ids of the finished clues in the clues table of the database
   */
  getAllFinishedClueIDsOfPath(pathID: number): number[] {
    const allClues = this.getCluesofPath(pathID);
    const allFinishedClueIDs: number[] = [];

    allClues.forEach((clueID) => {
      this.db.each(
        `SELECT finished FROM clues WHERE clue_id = ${clueID}`,
        [],
        (err, rows) => {
          if (err) {
            throw console.error(err.message);
          }
          rows.forEach((row) => {
            if (row.finished === 1) {
              allFinishedClueIDs.push(row.clue_id);
            }
          });
        }
      );
    });

    return allFinishedClueIDs;
  }

  /*





*/

  /**
   * Add a Crawl to the database.
   * @param crawlName the crawl to add
   * @return the id of the crawl in the database
   */
  addCrawl(crawlName: string): number {
    this.db.run(
      `INSERT INTO crawls(name) VALUES(${crawlName})
          WHERE NOT EXISTS(SELECT 1 FROM crawls WHERE name = ${crawlName})`,
      (err) => {
        if (err) {
          throw console.error(err.message);
        }
        console.log("Added crawl to database");
      }
    );

    let crawlId: number;
    this.db.get(
      `SELECT crawl_id FROM crawls WHERE name = ${crawlName}`,
      (err, row) => {
        if (err) {
          throw console.error(err.message);
        } else if (isNullOrUndefined(row)) {
          throw new Error("did not insert desired crawl");
        }
        crawlId = row.crawl_id;
      }
    );

    return crawlId;
  }

  // TODO

  // - create crawl without clue
  // - create crawl with clue -- this could end up getting recursive ! make helper methods to handle this without recurring
  // - delete crawl (and all clues)
  // - delete crawl without clues
  // - add clue to crawl
  //
  // - create path with clue(s)
  // - create path without clue
  // - add clue to path
  // - delete path
  // -groups
  //
  // other:
  // - add address table that clues reference
}
