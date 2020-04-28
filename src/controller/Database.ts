import * as fs from 'fs';
import * as sqlite3 from 'sqlite3';
import { Clue, Crawl } from './ClueController';
import { isNullOrUndefined } from 'util';

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
    let crawlId: number

    this.db.run("INSERT INTO crawls(name) SELECT " + crawl.name + 
    " WHERE NOT EXISTS(SELECT 1 FROM crawls WHERE name = " + crawl.name + ")", (err) => {
        if (err){
          throw console.error(err.message);
        }
        console.log("Added crawl to database")
    }).get("SELECT crawl_id FROM crawls WHERE crawls.name = " + crawl.name, (err, row) => {
      if (err){
        throw console.error(err.message);
      }
      else if (isNullOrUndefined(row)){
        throw new Error("did not insert desired crawl")
      }
      crawlId = row.crawl_id
    })

    return crawlId
  }

  /**
   * 
   * @param clue 
   */
  addClue(clue: Clue): number {

    if (clue.hasCrawl()) {
      const crawlId: number= this.addCrawl(clue.getCrawl())
      this.db.run("INSERT INTO clues(crawl_id, name, address, finished) VALUES(?)", 
      [crawlId, clue.getName(), clue.getPlace().getLocation(), 0])
    }
    this.db.run("INSERT INTO clues(crawl_id, name, address, finished) VALUES(?)", 
    [clue.getName(), clue.getPlace().getLocation(), 0])

    let clueId: number
    this.db.get("SELECT clue_id FROM clues WHERE clues.name = " + clue.getName(),(err, row) => {
      if (err){
        throw console.error(err.message);
      }
      else if (isNullOrUndefined(row)){
        throw new Error("did not insert desired clue")
      }
      clueId = row.clue_id
    })

    return clueId
  }
}
