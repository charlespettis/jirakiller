

CREATE TABLE canvas(
  id      CHAR(36)     PRIMARY KEY DEFAULT (UUID()),
  label   VARCHAR(100)

);

CREATE TABLE canvas_section (
  id          CHAR(36)     PRIMARY KEY DEFAULT (UUID()),
  label       VARCHAR(100),

  FOREIGN KEY (canvas_id) REFERENCES canvas(id)
);

CREATE TABLE card (
  id              CHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  label           TEXT,
  text_content    TEXT,
  order          INT,

  FOREIGN KEY (canvas_section_id) REFERENCES canvas_section(id)
);
