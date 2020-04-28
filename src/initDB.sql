PRAGMA foreign_keys = ON;

CREATE TABLE crawls (
    crawl_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE clues (
    clue_id INTEGER PRIMARY KEY,
    crawl_id INTEGER,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    image BLOB,
    finished INTEGER, -- 0 for unfinished, 1 for finished

    FOREIGN KEY (crawl_id)
        REFERENCES crawls (crawl_id)
);


CREATE TABLE paths (
    path_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);


-- represents a many to many relationship between paths and clues,
-- allowing us to store a list of paths associated with a clue or a list 
-- of clues associated with a path
CREATE TABLE paths_join_clues (
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
);