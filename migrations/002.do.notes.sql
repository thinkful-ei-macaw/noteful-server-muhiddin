CREATE TABLE notes_table (
    note_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    note_name TEXT NOT NULL,
    modified TIMESTAMPTZ DEFAULT now() NOT NULL,
    folder_id INTEGER REFERENCES folders_table(folder_id) ON DELETE CASCADE NOT NULL,
    content TEXT
);