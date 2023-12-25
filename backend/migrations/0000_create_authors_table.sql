CREATE TABLE authors (
    author_id INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE author_profiles (
    author_id INTEGER PRIMARY KEY REFERENCES authors(author_id),
    author_name TEXT NOT NULL
);

CREATE TABLE authors_firebase_info (
    author_id INTEGER,
    firebase_uid TEXT,
    PRIMARY KEY (author_id, firebase_uid),
    FOREIGN KEY (author_id) REFERENCES authors(author_id)
);