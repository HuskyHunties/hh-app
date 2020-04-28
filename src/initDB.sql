PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS crawls (
    crawl_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    UNIQUE(crawl_id, name) ON CONFLICT ABORT -- if a crawl with a duplicate name is inserted, this fails
);

CREATE TABLE IF NOT EXISTS clues (
    clue_id INTEGER PRIMARY KEY AUTOINCREMENT,
    crawl_id INTEGER,
    name TEXT NOT NULL,
    place TEXT NOT NULL,
    image BLOB,
    finished INTEGER, -- 0 for unfinished, 1 for finished

    FOREIGN KEY (crawl_id)
        REFERENCES crawls (crawl_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,

    UNIQUE(clue_id, name) ON CONFLICT ABORT -- clues cannot have duplicate names or ids
);

CREATE TABLE IF NOT EXISTS paths (
    path_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,

    UNIQUE(path_id, name) ON CONFLICT ABORT -- paths cannot have duplicate names or ids
);

-- represents a many to many relationship between paths and clues,
-- allowing us to store a list of paths associated with a clue or a list 
-- of clues associated with a path
CREATE TABLE IF NOT EXISTS paths_join_clues (
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
        REFERENCES crawls (clue_id)
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        REFERENCES clues (clue_id)
            ON DELETE CASCADE
            ON UPDATE NO ACTION
);
