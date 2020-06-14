/* eslint-disable @typescript-eslint/no-explicit-any */
import * as sqlite3 from "sqlite3";

/**
 * Wrapper class for the database to provide various ways to interact with it
 */
class DatabaseWrapper {
  protected db: sqlite3.Database;

  /**
   * Initializes the database by opening the file and running the initialization script
   * @param name - name is either the path (including ./) or the string ":memory:"
   * if the database should be created in memory
   */
  constructor(filepath: string) {
    // initialize the database field by opening the database file
    this.db = new sqlite3.Database(filepath, (err) => {
      if (err) {
        throw console.error(err.message);
      }
      console.log("Connected to the in-memory SQlite database.");

      this.db.run("PRAGMA journal_mode=WAL;", (err) => {
        if (err) {
          throw console.error(err.message);
        }
      });

      this.db.run(
        `CREATE TABLE IF NOT EXISTS clues (
          clue_id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          list_id TEXT,
          clue_number INTEGER,
          description TEXT,
          lat REAL,
          long REAL,
          image TEXT,
          finished INTEGER NOT NULL, 
      
          UNIQUE(list_id, clue_number) ON CONFLICT ABORT
          UNIQUE(lat, long) ON CONFLICT ABORT 
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
      
          UNIQUE(name) ON CONFLICT ABORT -- paths cannot have duplicate names or ids
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
          
          UNIQUE(path_id) ON CONFLICT ABORT
          UNIQUE(name) ON CONFLICT ABORT  
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
      this.db.configure("busyTimeout", 6000);
      console.log(`Initialized Database ${filepath}`);
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
        try {
          rows.forEach((row) => {
            clueIDs.push(row.clue_id);
          });
        } catch (error) {
          console.log(error);
          reject(error);
        }

        resolve(clueIDs);
      });
    });
  }

  /**
   *
   * @param clueID - the id of the clue being queried
   * @returns an string which is the base 64 encoding of the clue's image
   */
  getImageOfClue(clueID: number): Promise<string> {
    const db = this.db;
    let image: string;

    return new Promise((resolve, reject) => {
      db.get(
        `SELECT image FROM clues WHERE clue_id = ${clueID}`,
        (err, row) => {
          if (err) {
            reject(err);
          }
          try {
            image = row.image;
          } catch (error) {
            console.log(error);
            reject(error);
          }
          resolve(image);
        }
      );
    });
  }

  /**
   *
   * @param clueID - the id of the clue being queried
   * @returns an object containing the information on this clue
   */
  getInfoOfClue(clueID: number): Promise<object> {
    //TODO updatae with new columns of database
    const db = this.db;
    let name: string;
    let listID: string;
    let clueNumber: number;
    let description: string;
    let lat: number;
    let long: number;
    let finished: number;

    return new Promise((resolve, reject) => {
      db.get(
        `SELECT name, list_id, clue_number, description, lat, long, image, finished FROM clues WHERE clue_id = ${clueID}`,
        (err, row) => {
          if (err) {
            reject(err);
          }
          try {
            name = row.name;
            listID = row.list_id;
            clueNumber = row.clue_number;
            description = row.description;
            lat = row.lat;
            long = row.long;
            finished = row.finished;
          } catch (error) {
            console.log(error);
            reject(error);
          }
          resolve({
            name: name,
            listID: listID,
            clueNumber: clueNumber,
            description: description,
            lat: lat,
            long: long,
            finished: finished,
          });
        }
      );
    });
  }

  /**
   *  @returns an array of all the clue_ids of the unfinished clues in the clues table of the database
   */
  getAllUnfinishedClueIDs(): Promise<number[]> {
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
          try {
            rows.forEach((row) => {
              if (row.finished === 0) {
                allUnfinishedClueIDs.push(row.clue_id);
              }
            });
          } catch (error) {
            console.log(error);
            reject(error);
          }

          resolve(allUnfinishedClueIDs);
        }
      );
    });
  }

  /**
   *  @returns an array of all the clue_ids of the finished clues in the clues table of the database
   */
  getAllFinishedClueIDs(): Promise<number[]> {
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
          try {
            rows.forEach((row) => {
              if (row.finished === 1) {
                allFinishedClueIDs.push(row.clue_id);
              }
            });
          } catch (error) {
            console.log(error);
            reject(error);
          }

          resolve(allFinishedClueIDs);
        }
      );
    });
  }

  /**
   *
   * @param clueName - the name of the clue being created
   * @param place - the place where the clue is found
   * @param crawlID - the id of the crawl the clue is part of, could be null
   * @returns - information on the created clue
   */
  addClue(
    clueName: string,
    listID: string,
    clueNumber: number,
    description: string,
    lat: number,
    long: number
  ): Promise<object> {
    const db = this.db;
    return new Promise((resolve, reject) => {
      // if the clue has a crawl, add its crawl to the database; else, only add the clue

      db.run(
        "INSERT INTO clues(name, list_id, clue_number, description, lat, long, finished) VALUES(?, ?, ?, ?, ?, ?, ?)",
        [clueName, listID, clueNumber, description, lat, long, 0],
        (err) => {
          if (err) {
            reject(err.message);
          } else {
            resolve({});
          }
        }
      );
    });
  }

  /**
   *
   * @param clueID - the id of the clue being deleted
   * @returns - information on the deleted clue
   */
  deleteClue(clueID: number): Promise<object> {
    // TODO: update from new columns of database
    const db = this.db;

    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM clues WHERE clue_id = ${clueID}`, (err) => {
        if (err) {
          reject(err.message);
        } else {
          resolve({});
        }
      });
    });
  }

  /**
   *
   * @param clueID - id of the clue being modified
   * @param imageEncoding - the string of the image encoding
   * @returns the given image string
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

  updateClue(
    clueID: number,
    name: string,
    listID: string,
    clueNumber: number,
    description: string,
    lat: number,
    long: number
  ): Promise<object> {
    const db = this.db;
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE clues SET name = '${name}', list_id = '${listID}', clue_number = ${clueNumber}, description = '${description}', lat = ${lat}, long = ${long} WHERE clue_id = ${clueID}`,
        (err) => {
          if (err) {
            console.log(err);
            reject(err.message);
          }
          resolve({});
        }
      );
    });
  }

  /**
   *
   * @param clueID - id of the clue being marked as finished
   * @returns 1, representing a finished clue
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
   * @returns an array of all the group ids in the groups table
   */
  getAllGroups(): Promise<number[]> {
    const db = this.db;
    return new Promise(function (resolve, reject) {
      const allGroupIDs: number[] = [];

      db.all(`SELECT group_id FROM groups`, [], (err, rows) => {
        if (err) {
          //throw console.error(err.message)
          reject(err);
        }
        try {
          rows.forEach((row) => {
            allGroupIDs.push(row.group_id);
          });
        } catch (error) {
          console.log(error);
          reject(error);
        }
        resolve(allGroupIDs);
      });
    });
  }

  /**
   *
   * @param groupID - the id of the group being queried
   * @returns a \{name, pathID\} object of this group
   *
   * */
  getInfofGroup(groupID: number): Promise<object> {
    const db = this.db;
    return new Promise(function (resolve, reject) {
      let name: string;
      let pathID: number;

      db.get(
        `SELECT name, path_id from groups WHERE group_id = ${groupID}`,
        (err, row) => {
          if (err) {
            reject(err);
          }

          try {
            name = row.name;
            pathID = row.path_id;
          } catch (error) {
            console.log(error);
            reject(error);
          }
          resolve({ groupID: groupID, name: name, pathID: pathID });
        }
      );
    });
  }

  /**
   *
   * @param name - the name of the group being added to the database
   * @returns information on created group
   */
  addGroup(groupName: string): Promise<object> {
    console.log("adding group " + groupName);
    const db = this.db;
    return new Promise(function (resolve, reject) {
      db.run(`INSERT INTO groups (name) VALUES(?)`, [groupName], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({});
        }
      });
    });
  }

  /**
   *
   * @param groupID - the id of the group being deleted
   * @returns an object containing the name and path of the group which was deleted
   */
  deleteGroup(groupID: number): Promise<object> {
    const db = this.db;
    return new Promise(function (resolve, reject) {
      db.run(`DELETE FROM groups WHERE group_id = ${groupID}`, (err) => {
        if (err) {
          reject(err.message);
        } else {
          resolve({});
        }
      });
    });
  }

  /**
   *
   * @param groupID - id of the group being modified
   * @param pathID - the id of the path being added to this group
   * sets the path_id of the specified group to the specified path
   * @returns information on group being modified
   */
  setPathOfGroupTo(groupID: number, newPathID: number): Promise<object> {
    const db = this.db;
    return new Promise(function (resolve, reject) {
      db.run(
        `UPDATE groups SET path_id = ${newPathID} WHERE group_id = ${groupID}`,
        (err) => {
          if (err) {
            console.log(err.message);
            reject(err.message);
          } else {
            resolve({});
          }
        }
      );
    });
  }

  /**
   *
   * @param groupID - id of the group being modified
   * @param newName - new name of the group
   * @returns information on group being modified
   */

  changeGroupName(groupID: number, newName: string): Promise<object> {
    const db = this.db;
    return new Promise(function (resolve, reject) {
      db.run(
        `UPDATE groups SET name = '${newName}' WHERE group_id = ${groupID}`,
        (err) => {
          if (err) {
            reject(err.message);
          } else {
            resolve({});
          }
        }
      );
    });
  }

  // PATH TABLE METHODS - path and join tables

  /**
   * @returns an array of all the group ids in the paths table
   */
  getAllPaths(): Promise<number[]> {
    const db = this.db;
    return new Promise(function (resolve, reject) {
      const allPathIDs: number[] = [];

      db.all(`SELECT path_id FROM paths`, [], (err, rows) => {
        if (err) {
          //throw console.error(err.message)
          reject(err);
        }
        try {
          rows.forEach((row) => {
            allPathIDs.push(row.path_id);
          });
        } catch (error) {
          console.log(error);
          reject(error);
        }
        resolve(allPathIDs);
      });
    });
  }

  /**
   *
   * @param pathID - id of the path being queried
   * @returns all the clue IDs associated with the specific clue
   */
  getCluesofPath(pathID: number): Promise<object> {
    const db = this.db;
    return new Promise((resolve, reject) => {
      let name: string;

      db.get(`SELECT name FROM paths WHERE path_id = ${pathID}`, (err, row) => {
        if (err) {
          reject(err.message);
        }
        try {
          name = row.name;
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });

      const clueIDs: number[] = [];

      // collecting the clue ids from the join table
      db.all(
        `SELECT clue_id FROM paths_join_clues WHERE path_id = ${pathID}`,
        (err, rows) => {
          if (err) {
            reject(err.message);
          }
          try {
            rows.forEach((row) => {
              clueIDs.push(row.clue_id);
            });
          } catch (error) {
            console.log(error);
            reject(error);
          }

          resolve({ name: name, clueIDs: clueIDs });
        }
      );
    });
  }

  /**
   * @param pathID - ID of path being queried
   *  @returns an array of all the clue_ids of the unfinished clues in the clues table of the database
   */
  async getAllUnfinishedCluesOfPath(pathID: number): Promise<object> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    //@ts-ignore
    const allClues = (await this.getCluesofPath(pathID)).clueIDs;
    const db = this.db;

    return new Promise(async (resolve, reject) => {
      let name: string;
      db.get(`SELECT name FROM paths WHERE path_id = ${pathID}`, (err, row) => {
        if (err) {
          reject(err.message);
        }
        try {
          name = row.name;
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });

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
        try {
          rows.forEach((row) => {
            if (row.finished === 0) {
              allUnfinishedClueIDs.push(row.clue_id);
            }
          });
        } catch (error) {
          console.log(error);
          reject(error);
        }

        resolve({ name: name, clueIDs: allUnfinishedClueIDs });
      });
    });
  }

  /**
   * @param pathID - ID of path being queried
   *  @returns an array of all the clue_ids of the finished clues in the clues table of the database
   */
  async getAllFinishedCluesOfPath(pathID: number): Promise<object> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    //@ts-ignore
    const allClues = (await this.getCluesofPath(pathID)).clueIDs;
    const db = this.db;

    return new Promise(async (resolve, reject) => {
      let name: string;
      db.get(`SELECT name FROM paths WHERE path_id = ${pathID}`, (err, row) => {
        if (err) {
          reject(err.message);
        }
        try {
          name = row.name;
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });

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
        try {
          rows.forEach((row) => {
            if (row.finished === 1) {
              allFinishedClueIDs.push(row.clue_id);
            }
          });
        } catch (error) {
          console.log(error);
          reject(error);
        }

        resolve({ name: name, clueIDs: allFinishedClueIDs });
      });
    });
  }

  /**
   *
   * @param name- name of path being added to the database
   * @returns an object containing the information on the paths
   */
  addPath(name: string): Promise<object> {
    const db = this.db;
    return new Promise((resolve, reject) => {
      db.run(`INSERT INTO paths (name) VALUES(?)`, [name], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({});
        }
      });
    });
  }

  /**
   *
   * @param pathID - path being deleted
   * @returns an object of the clueIDs which were on this path
   */
  removePath(pathID: number): Promise<object> {
    const db = this.db;
    return new Promise((resolve, reject) => {
      //deleting the path from the path table
      db.run(`DELETE FROM paths WHERE path_id = ${pathID}`, (err) => {
        if (err) {
          reject(err.message);
        } else {
          resolve({});
        }
      });
    });
  }

  /**
   * adds the specified clue to the specified path in the join table
   * @param pathID - path being modified
   * @param clueID - clue being added to path
   * @returns - information on this path and clue
   */
  addClueToPath(pathID: number, clueID: number): Promise<object> {
    const db = this.db;
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO paths_join_clues (path_id, clue_id) VALUES(?, ?)`,
        [pathID, clueID],
        (err) => {
          if (err) {
            reject(err.message);
          } else {
            resolve({});
          }
        }
      );
    });
  }

  /**
   * removes the specified clue from the specified path
   * @param pathID - path being modified
   * @param clueID - clue being removed
   * @returns - the clueID removed
   */
  removeClueFromPath(pathID: number, clueID: number): Promise<object> {
    const db = this.db;
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM paths_join_clues WHERE path_id = ${pathID} AND clue_id = ${clueID}`,
        (err) => {
          if (err) {
            reject(err.message);
          } else {
            resolve({});
          }
        }
      );
    });
  }

  // CRAWL TABLE METHODS

  /**
   * @returns - the ids of all the crawls
   */
  getAllCrawls(): Promise<number[]> {
    const db = this.db;
    const crawlIDs: number[] = [];
    return new Promise((resolve, reject) => {
      db.all(`SELECT crawl_id FROM crawls`, (err, rows) => {
        if (err) {
          reject(console.error());
        }

        try {
          rows.forEach((row) => {
            crawlIDs.push(row.crawl_id);
          });
        } catch (error) {
          console.log(error);
          reject(error);
        }
        resolve(crawlIDs);
      });
    });
  }
  /**
   *  returns a list of the clues in the specified crawl
   * @param crawlID - id of crawl being queried
   * @returns - the ids of all the clues in this crawl
   */
  getCluesOfCrawl(crawlID: number): Promise<number[]> {
    const db = this.db;
    const clueIDs: number[] = [];
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT clue_id FROM clues WHERE crawl_id = ${crawlID}`,
        (err, rows) => {
          if (err) {
            reject(console.error());
          }
          try {
            rows.forEach((row) => {
              clueIDs.push(row.clue_id);
            });
          } catch (error) {
            console.log(error);
            reject(error);
          }
          resolve(clueIDs);
        }
      );
    });
  }

  /**
   *  returns a list of the unfinished clues in the specified crawl
   * @param crawlID - id of crawl being queried
   * @returns - the ids of all the unfinished clues in this crawl
   */
  getAllUnfinishedCluesOfCrawl(crawlID: number): Promise<number[]> {
    const db = this.db;
    const clueIDs: number[] = [];
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT clue_id FROM clues WHERE crawl_id = ${crawlID} AND finished = 0`,
        (err, rows) => {
          if (err) {
            reject(console.error());
          }
          try {
            rows.forEach((row) => {
              clueIDs.push(row.clue_id);
            });
          } catch (error) {
            console.log(error);
            reject(error);
          }
          resolve(clueIDs);
        }
      );
    });
  }
  /**
   *  returns a list of the finished clues in the specified crawl
   * @param crawlID - id of crawl being queried
   * @returns - the ids of all the finished clues in this crawl
   */
  getAllFinishedCluesOfCrawl(crawlID: number): Promise<number[]> {
    const db = this.db;
    const clueIDs: number[] = [];
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT clue_id FROM clues WHERE crawl_id = ${crawlID} AND finished = 1`,
        (err, rows) => {
          if (err) {
            reject(console.error());
          }
          try {
            rows.forEach((row) => {
              clueIDs.push(row.clue_id);
            });
          } catch (error) {
            console.log(error);
            reject(error);
          }
          resolve(clueIDs);
        }
      );
    });
  }

  /**
   * Add a Crawl to the database.
   * @param crawlName -the name of the crawl to add
   * @returns - object representing the information of the removed crawl
   */
  addCrawl(crawlName: string): Promise<object> {
    const db = this.db;
    return new Promise((resolve, reject) => {
      db.run(`INSERT INTO crawls (name) VALUES(?)`, [crawlName], (err) => {
        if (err) {
          if (err) {
            reject(err);
          } else {
            resolve({});
          }
        }
      });
    });
  }

  /**
   * returns the info of the specified crawl, (crawlID, name)
   * @param crawlID - id of the crawl being queried
   * @returns - object representing the information of the removed crawl
   */

  getInfoOfCrawl(crawlID: number): Promise<object> {
    const db = this.db;
    return new Promise((resolve, reject) => {
      let name: string;
      db.get(
        `SELECT name FROM crawls WHERE crawl_id = ${crawlID}`,
        (err, row) => {
          if (err) {
            reject(err.message);
          }
          try {
            name = row.name;
          } catch (error) {
            console.log(error);
            reject(error);
          }
          resolve({ crawlID: crawlID, name: name });
        }
      );
    });
  }

  /**
   * deletes the specified crawl and returns its information as an object
   * @param crawlID - id of the crawl being removed
   * @returns - object representing the information of the removed crawl
   */
  async removeCrawl(crawlID: number): Promise<object> {
    const db = this.db;
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM crawls where crawl_id = ${crawlID}`, (err) => {
        if (err) {
          reject(err.message);
        } else {
          resolve({});
        }
      });
    });
  }
}

export const dbWrapper = new DatabaseWrapper("hh.db");
