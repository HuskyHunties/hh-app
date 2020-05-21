import * as fs from "fs";
import * as path from "path";
import * as sqlite3 from "sqlite3";
import { isNullOrUndefined } from "util";
import { response } from "express";

/**
 * Wrapper class for the database to provide various ways to interact with it
 */
class DatabaseWrapper {
  protected db: sqlite3.Database;

  /**
   * Initializes the database by opening the file and running the initialization script
   * @param name name is either the path (including ./) or the string ":memory:"
   * if the database should be created in memory
   */
  constructor(fileName: string) {
    // initialize the database field by opening the database file
    this.db = new sqlite3.Database("src/hh.db", (err) => {
      if (err) {
        throw console.error(err.message);
      }
      console.log("Connected to the in-memory SQlite database.");

      /* // run the initialization script on the database
      this.db.run(fs.readFileSync(path.resolve(__dirname, "../initDB.sql"), "utf8"), (err) => {
        if (err) {
          throw console.error(err.message);
        }
        console.log("Successfully initialized the database.");
      }); */

      this.db.run(
        `CREATE TABLE IF NOT EXISTS crawls (
          crawl_id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          UNIQUE(crawl_id, name) ON CONFLICT ABORT 
      );`,
        (err) => {
          if (err) {
            throw console.error(err.message);
          }
        }
      );

      this.db.run(
        `CREATE TABLE IF NOT EXISTS clues (
          clue_id INTEGER PRIMARY KEY AUTOINCREMENT,
          crawl_id INTEGER,
          name TEXT NOT NULL,
          place TEXT NOT NULL,
          image TEXT,
          finished INTEGER NOT NULL, 
      
          FOREIGN KEY (crawl_id)
              REFERENCES crawls (crawl_id)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
      
          UNIQUE(clue_id, name) ON CONFLICT ABORT 
      );`,
        (err) => {
          if (err) {
            throw console.error(err.message);
          }
        }
      );

      this.db.run(
        `CREATE TABLE IF NOT EXISTS paths (
          path_id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
      
          UNIQUE(path_id, name) ON CONFLICT ABORT -- paths cannot have duplicate names or ids
      );`,
        (err) => {
          if (err) {
            throw console.error(err.message);
          }
        }
      );

      this.db.run(
        `CREATE TABLE IF NOT EXISTS groups (
          group_id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          path_id INTEGER,
      
          FOREIGN KEY (path_id)
              REFERENCES paths (path_id)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
          
          UNIQUE(group_id, name) ON CONFLICT ABORT  
      );`,
        (err) => {
          if (err) {
            throw console.error(err.message);
          }
        }
      );

      this.db.run(
        `CREATE TABLE IF NOT EXISTS paths_join_clues (
          path_id INTEGER,
          clue_id INTEGER,
      
          PRIMARY KEY (path_id, clue_id),
          FOREIGN KEY (path_id)
              REFERENCES paths (path_id)
                  ON DELETE CASCADE
                  ON UPDATE NO ACTION,
          FOREIGN KEY (clue_id)
              REFERENCES clues (clue_id)
                  ON DELETE CASCADE
                  ON UPDATE NO ACTION
      );`,
        (err) => {
          if (err) {
            throw console.error(err.message);
          }
        }
      );
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
   * @returns an array of all the clue_ids in the clues table of the database
   */
  getAllClueIDs(): Promise<number[]> {
    const db = this.db;
    return new Promise((resolve, reject) => {
      const clueIDs: number[] = [];

      // collecting the clue ids from the join table
      db.all(`SELECT clue_id FROM clues`, (err, rows) => {
        if (err) {
          reject(err.message);
        }
        rows.forEach((row) => {
          clueIDs.push(row.clue_id);
        });

        resolve(clueIDs);
      });
    });
  }

  /**
   * return an object containing the information on this clue
   * @param clueID
   */
  getInfoOfClue(clueID: number): Promise<object> {
    const db = this.db;
    let crawlID: number;
    let name: string;
    let place: string;
    let image: string;
    let finished: number;

    return new Promise((resolve, reject) => {
      db.get(
        `SELECT crawl_id, name, place, image, finished FROM clues WHERE clue_id = ${clueID}`,
        (err, row) => {
          if (err) {
            reject(err);
          }
          crawlID = row.crawl_id;
          name = row.name;
          place = row.place;
          image = row.image;
          finished = row.finished;

          resolve({
            crawlID: crawlID,
            name: name,
            place: place,
            image: image,
            finished: finished,
          });
        }
      );
    });
  }

  /**
   *  @returns an array of all the clue_ids of the unfinished clues in the clues table of the database
   */
  async getAllUnfinishedClueIDs(): Promise<number[]> {
    const db = this.db;

    return new Promise(async (resolve, reject) => {
      const allUnfinishedClueIDs: number[] = [];

      db.all(
        `SELECT clue_id, finished FROM clues WHERE finished = 0`,
        [],
        (err, rows) => {
          if (err) {
            reject(err.message);
          }
          console.log(rows);
          rows.forEach((row) => {
            if (row.finished === 0) {
              allUnfinishedClueIDs.push(row.clue_id);
            }
          });

          resolve(allUnfinishedClueIDs);
        }
      );
    });
  }

  /**
   *  @returns an array of all the clue_ids of the finished clues in the clues table of the database
   */
  async getAllFinishedClueIDs(): Promise<number[]> {
    const db = this.db;

    return new Promise(async (resolve, reject) => {
      const allFinishedClueIDs: number[] = [];

      db.all(
        `SELECT clue_id, finished FROM clues WHERE finished = 1`,
        [],
        (err, rows) => {
          if (err) {
            reject(err.message);
          }
          console.log(rows);
          rows.forEach((row) => {
            if (row.finished === 1) {
              allFinishedClueIDs.push(row.clue_id);
            }
          });

          resolve(allFinishedClueIDs);
        }
      );
    });
  }

  /**
   *
   * @param name
   * @param place
   * @param crawlId
   */
  addClue(
    name: string,
    place: string,
    crawlId: number
  ): Promise<Record<string, any>> {
    const db = this.db;
    return new Promise((resolve, reject) => {
      // if the clue has a crawl, add its crawl to the database; else, only add the clue
      if (!isNullOrUndefined(crawlId)) {
        db.run(
          "INSERT INTO clues(crawl_id, name, place, finished) VALUES(?, ?, ?, ?)",
          [crawlId, name, place, 0],
          (err) => {
            if (err) throw console.error(err.message);
          }
        );
      } else {
        db.run(
          "INSERT INTO clues(name, place, finished) VALUES(?, ?, ?)",
          [name, place, 0],
          (err) => {
            if (err) throw console.error(err.message);
          }
        );
      }

      // retrieve the clue ID registered from the database
      let clueId: number;
      db.get(`SELECT clue_id FROM clues WHERE name = '${name}'`, (err, row) => {
        if (err) {
          throw console.error(err.message);
        } else if (isNullOrUndefined(row)) {
          throw new Error("did not insert desired clue");
        }
        clueId = row.clue_id;
        resolve({
          clueID: clueId,
          crawlID: crawlId,
          name: name,
          place: place,
          finished: 0,
        });
      });
    });
  }

  /**
   *
   * @param clueID
   */
  deleteClue(clueID: number): Promise<Record<string, any>> {
    const db = this.db;
    let crawlID: number;
    let name: string;
    let place: string;
    let image: string;
    let finished: number;

    return new Promise((resolve, reject) => {
      db.get(
        `SELECT crawl_id, name, place, image, finished FROM clues WHERE clue_id = ${clueID}`,
        (err, row) => {
          if (err) {
            reject(err);
          }
          crawlID = row.crawl_id;
          name = row.name;
          place = row.place;
          image = row.image;
          finished = row.finished;
        }
      );
      db.run(`DELETE FROM clues WHERE clue_id = ${clueID}`, (err) => {
        if (err) {
          reject(err.message);
        }
        resolve({
          crawlID: crawlID,
          name: name,
          place: place,
          image: image,
          finished: finished,
        });
      });
    });
  }

  /**
   *
   * @param clueID
   * @param imageEncoding
   */
  addPictureToClue(clueID: number, imageEncoding: string): Promise<string> {
    const db = this.db;
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE clues SET image = '${imageEncoding}' WHERE clue_id = ${clueID}`,
        (err) => {
          if (err) {
            reject(err.message);
          }
          resolve(imageEncoding);
        }
      );
    });
  }

  /**
   *
   * @param clueID
   */
  finishClue(clueID: number): Promise<number> {
    const db = this.db;
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE clues SET finished = 1 WHERE clue_id = ${clueID}`,
        (err) => {
          if (err) {
            reject(err.message);
          }
          resolve(1);
        }
      );
    });
  }

  // Group TABLE Methods

  /**
   * returns an array of all the group ids in the groups table
   */
  getAllGroups(): Promise<number[]> {
    const db = this.db;
    return new Promise(function (resolve, reject) {
      const allGroupIDs: number[] = [];

      db.all(`SELECT group_id FROM groups`, [], (err, rows) => {
        if (err) {
          //throw console.error(err.message)
          reject(err);
        } else {
          rows.forEach((row) => {
            allGroupIDs.push(row.group_id);
          });
          resolve(allGroupIDs);
        }
      });
    });
  }

  /**
   *
   * @param groupID
   * returns a {name, pathID} object of this group
   *
   *
   * the return type is Promise<Object>
   * */
  getInfofGroup(groupID: number): Promise<Record<string, any>> {
    const db = this.db;
    return new Promise(function (resolve, reject) {
      let name: string;
      let pathID: number;

      db.get(
        `SELECT name, path_id from groups WHERE group_id = ${groupID}`,
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            name = row.name;
            pathID = row.path_id;
            resolve({ groupID: groupID, name: name, pathID: pathID });
          }
        }
      );
    });
  }

  /**
   *
   * @param name
   * returns the id of the created group
   */
  createGroup(groupName: string): Promise<Record<string, any>> {
    const db = this.db;
    return new Promise(function (resolve, reject) {
      let groupID: number;

      db.run(`INSERT INTO groups (name) VALUES(?)`, [groupName], (err) => {
        if (err) reject(err);
      });

      db.get(
        `SELECT group_id, name from groups WHERE name = '${groupName}'`,
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve({ groupID: row.group_id, name: row.name });
          }
        }
      );
    });
  }

  /**
   *
   * @param groupID
   * returns the ID of the path this group had
   */
  deleteGroup(groupID: number): Promise<Record<string, any>> {
    const db = this.db;
    return new Promise(function (resolve, reject) {
      let name: string;
      let pathID: number;

      db.get(
        `SELECT name, path_id from groups WHERE group_id = ${groupID}`,
        (err, row) => {
          if (err) {
            reject(err.message);
          }
          name = row.name;
          pathID = row.path_id;
        }
      );

      db.run(`DELETE FROM groups WHERE group_id = ${groupID}`, (err, row) => {
        if (err) {
          reject(err.message);
        } else {
          resolve({ name: name, pathID: pathID });
        }
      });
    });
  }

  /**
   *
   * @param groupID
   * @param pathID
   * sets the path_id of the specified group to the specified path
   */
  setPathOfGroupTo(
    groupID: number,
    newPathID: number,
    override?: boolean
  ): Promise<Record<string, any>> {
    const db = this.db;
    return new Promise(function (resolve, reject) {
      db.run(
        `UPDATE groups SET path_id = ${newPathID} WHERE group_id = ${groupID}`,
        (err) => {
          if (err) {
            reject(err.message);
          }
        }
      );

      let name: string;
      let pathID: number;

      db.get(
        `SELECT name, path_id from groups WHERE group_id = ${groupID}`,
        (err, row) => {
          if (err) {
            reject(err.message);
          }
          name = row.name;
          pathID = row.path_id;
          resolve({ name: name, pathID: pathID });
        }
      );
    });
  }

  /**
   *
   * @param groupID
   * @param newName
   * returns the given group id that is being modified
   */

  changeGroupName(
    groupID: number,
    newName: string
  ): Promise<Record<string, any>> {
    const db = this.db;
    return new Promise(function (resolve, reject) {
      db.run(
        `UPDATE groups SET name = '${newName}' WHERE group_id = ${groupID}`,
        (err) => {
          if (err) {
            reject(err.message);
          }
        }
      );

      let name: string;
      let pathID: number;

      db.get(
        `SELECT name, path_id from groups WHERE group_id = ${groupID}`,
        (err, row) => {
          if (err) {
            reject(err.message);
          }
          name = row.name;
          pathID = row.path_id;
          resolve({ name: name, pathID: pathID });
        }
      );
    });
  }

  // PATH TABLE METHODS - path and join tables

  /**
   *
   * @param pathID
   * returns all the clue IDs associated with the specific clue
   */
  getCluesofPath(pathID: number): Promise<number[]> {
    const db = this.db;
    return new Promise((resolve, reject) => {
      const clueIDs: number[] = [];

      // collecting the clue ids from the join table
      db.all(
        `SELECT clue_id FROM paths_join_clues WHERE path_id = ${pathID}`,
        (err, rows) => {
          if (err) {
            reject(err.message);
          }
          rows.forEach((row) => {
            clueIDs.push(row.clue_id);
          });

          resolve(clueIDs);
        }
      );
    });
  }

  /**
   *  @returns an array of all the clue_ids of the unfinished clues in the clues table of the database
   */
  async getAllIncompleteCluesOfPath(pathID: number): Promise<number[]> {
    const allClues = await this.getCluesofPath(pathID);
    const db = this.db;

    return new Promise(async (resolve, reject) => {
      const allUnfinishedClueIDs: number[] = [];

      let clueIDSQL = `SELECT clue_id, finished FROM clues WHERE finished = 0 AND`;

      allClues.forEach((clueID) => {
        clueIDSQL += ` clue_id = ${clueID} OR`;
      });

      clueIDSQL = clueIDSQL.slice(0, clueIDSQL.length - 3);

      db.all(clueIDSQL, [], (err, rows) => {
        if (err) {
          reject(err.message);
        }
        console.log(rows);
        rows.forEach((row) => {
          if (row.finished === 0) {
            allUnfinishedClueIDs.push(row.clue_id);
          }
        });

        resolve(allUnfinishedClueIDs);
      });
    });
  }

  /**
   *  @returns an array of all the clue_ids of the finished clues in the clues table of the database
   */
  async getAllCompletedCluesOfPath(pathID: number): Promise<number[]> {
    const allClues = await this.getCluesofPath(pathID);
    const db = this.db;

    return new Promise(async (resolve, reject) => {
      const allFinishedClueIDs: number[] = [];

      let clueIDSQL = `SELECT clue_id, finished FROM clues WHERE finished = 1 AND`;

      allClues.forEach((clueID) => {
        clueIDSQL += ` clue_id = ${clueID} OR`;
      });

      clueIDSQL = clueIDSQL.slice(0, clueIDSQL.length - 3);
      console.log(clueIDSQL);

      db.all(clueIDSQL, [], (err, rows) => {
        if (err) {
          reject(err.message);
        }
        console.log(rows);
        rows.forEach((row) => {
          if (row.finished === 1) {
            allFinishedClueIDs.push(row.clue_id);
          }
        });

        resolve(allFinishedClueIDs);
      });
    });
  }

  /**
   *
   * @param clueIDs
   * returns the id of the created path
   */
  createPath(name: string): Promise<Record<string, any>> {
    const db = this.db;
    return new Promise((resolve, reject) => {
      db.run(`INSERT INTO paths (name) VALUES(?)`, [name], (err) => {
        if (err) throw console.error(err.message);
      });

      let pathID: number;

      db.get(`SELECT path_id from paths WHERE name = '${name}'`, (err, row) => {
        if (err) {
          reject(err);
        }
        pathID = row.path_id;
        resolve({ pathID: pathID, name: name });
      });
    });
  }

  /**
   *
   * @param pathID
   * returns an array of the clueIDs which were on this path
   */
  removePath(pathID: number): Promise<Record<string, any>> {
    const db = this.db;
    return new Promise((resolve, reject) => {
      let name: string;
      const clueIDs: number[] = [];
      db.get(`SELECT name FROM paths WHERE path_id = ${pathID}`, (err, row) => {
        if (err) {
          reject(err.message);
        }
        name = row.name;
      });

      // collecting the clue ids from the join table
      db.each(
        `SELECT clue_id FROM paths_join_clues WHERE path_id = ${pathID}`,
        (err, rows) => {
          if (err) {
            reject(err.message);
          }

          rows.forEach((row) => {
            clueIDs.push(row.clue_id);
          });
        }
      );

      //deleting the path from the path table
      db.run(`DELETE FROM paths WHERE path_id = ${pathID}`, (err) => {
        if (err) {
          reject(err.message);
        }
        resolve({ name: name, clueIDs: clueIDs });
      });
    });
  }

  /**
   * adds the specified clue to the specified path in the join table
   * @param pathID
   * @param clueID
   */
  addClueToPath(pathID: number, clueID: number): Promise<Record<string, any>> {
    const db = this.db;
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO paths_join_clues (path_id, clue_id) VALUES(?, ?)`,
        [pathID, clueID],
        (err) => {
          if (err) {
            reject(err.message);
          }
          resolve({ pathID: pathID, clueID: clueID });
        }
      );
    });
  }

  /**
   * removes the specified clue from the specified path
   * @param pathID
   * @param clueID
   * returns the clueID removed
   */
  removeClueFromPath(
    pathID: number,
    clueID: number
  ): Promise<Record<string, any>> {
    const db = this.db;
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM paths_join_clues WHERE path_id = ${pathID} AND clue_id = ${clueID}`,
        (err) => {
          if (err) {
            throw console.error(err.message);
          }
          resolve({ pathID: pathID, clueID: clueID });
        }
      );
    });
  }

  // CRAWL TABLE METHODS

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
  //
  // other:
  // - add place table that clues reference
}

export const dbWrapper = new DatabaseWrapper("hh-db");
