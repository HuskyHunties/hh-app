import * as fs from "fs";
import * as sqlite3 from "sqlite3";
import { Clue, Crawl, Image } from "./ClueController";
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
  public close() {
    this.db.close((err) => {
      if (err) {
        return false;
      }
      console.log("Close the database connection.");
      return true;
    });
  }

  /**
   * Add a Crawl to the database.
   * @param crawl the crawl to add
   * @return the id of the crawl in the database
   */
  addCrawl(crawl: Crawl): number {
    let crawlId: number;

    this.db
      .run(
        "INSERT INTO crawls(name) VALUES(" +
          crawl.getName() +
          ")" +
          " WHERE NOT EXISTS(SELECT 1 FROM crawls WHERE name = " +
          crawl.getName() +
          ")",
        (err) => {
          if (err) {
            throw console.error(err.message);
          }
          console.log("Added crawl to database");
        }
      )
      .get(
        "SELECT crawl_id FROM crawls WHERE name = " + crawl.getName(),
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

  /**
   * Add a Clue to the database as well as its associated Crawl as needed
   * @param clue the clue to add to the database
   * @return the id of the clue in the database
   */
  addClue(clue: Clue): number {
    // if the clue has a crawl, add its crawl to the database; else, only add the clue
    if (clue.hasCrawl()) {
      const crawlId: number = this.addCrawl(clue.getCrawl());
      this.db.run(
        "INSERT INTO clues(crawl_id, name, address, finished) VALUES(?)",
        [crawlId, clue.getName(), clue.getPlace().getLocation(), 0],
        (err) => {
          if (err) throw console.error(err.message);
        }
      );
    } else {
      this.db.run(
        "INSERT INTO clues(crawl_id, name, address, finished) VALUES(?)",
        [clue.getName(), clue.getPlace().getLocation(), 0],
        (err) => {
          if (err) throw console.error(err.message);
        }
      );
    }

    // retrieve the clue ID registered from the database
    let clueId: number;
    this.db.get(
      "SELECT clue_id FROM clues WHERE name = " + clue.getName(),
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
   * @param clueName the name of the clue this method is modifying
   * @param picture the picture being added to this clue
   * @return the id of the clue being modified
   */
  addPictureToClue(clueName: string, pictureEncoding: string): number {
    // can we assume that this method will only be called with the names
    // of clues which we know to have beena added, and don't have to check for a clue?

    this.db.run(
      `UPDATE clues SET image = ${pictureEncoding} where name = ` + clueName,
      (err) => {
        if (err) throw console.error(err.message);
      }
    );

    // retrieve the clue ID registered from the database
    let clueId: number;
    this.db.get(
      "SELECT clue_id FROM clues WHERE name = " + clueName,
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
   * @param clueName
   * @return the id of the clue being modified
   */
  completeClue(clueName: string): number {
    this.db.run("UPDATE clues SET finished = 1 where name = " + clueName);

    // retrieve the clue ID registered from the database
    let clueId: number;
    this.db.get(
      "SELECT clue_id FROM clues WHERE name = " + clueName,
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
   * @param clueName name of the clue being modified
   * @return the id of the clue being deleted?? idk if this is accessible
   * after the row has been deleted from the table
   */
  deleteClue(clueName: string): void {
    this.db.run("DELETE FROM clues WHERE name = " + clueName);
  }
  // TODO
  // - add picture to clue - draft done
  // - 'complete' clue - draft done
  // - delete clue - draft done
  // - other information to update with clue?
  //
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
