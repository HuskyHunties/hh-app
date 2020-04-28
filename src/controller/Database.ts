import * as fs from 'fs';
import * as sqlite3 from 'sqlite3';
import { Clue, Crawl } from './ClueController';

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
      console.log('Connected to the in-memory SQlite database.');

      // run the initialization script on the database
      this.db.run(fs.readFileSync("./initDB.sql", "utf8"), (err) => {
        if (err) {
          throw console.error(err.message);
        }
        console.log('Successfully initialized the database.');
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
      console.log('Close the database connection.');
      return true;
    });
  }


  addCrawl(crawl: Crawl): number {
    
  }

  /**
   * 
   * @param clue 
   */
  addClue(clue: Clue) {
    if (clue.hasCrawl()) {
      
    }
    this.db.run("INSERT INTO clues(crawl_id, name, address, image, finished) VALUES(?)", 
    [clue.])
  }
}