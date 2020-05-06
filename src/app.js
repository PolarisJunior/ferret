const path = require("path");
const process = require("process");
const util = require("util");
const fs = require("fs");

const sqlite3 = require("sqlite3").verbose();

const CONFIG_DIR = "config";
const CONFIG_FILE = "config.json";

const DATABASE_DIR = "database";

const config = require(path.join(process.cwd(), CONFIG_DIR, CONFIG_FILE));

const db_path = path.join(DATABASE_DIR, config.database_file);

if (fs.existsSync(db_path)) {
    fs.unlinkSync(db_path)
}

const db = new sqlite3.Database(db_path);

db.serialize(() => {
  db.run("CREATE TABLE lorem (info TEXT)");

  let stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (let i = 0; i < 10; i++) {
    stmt.run(`Ipsum ${i}`);
  }

  stmt.finalize();

  db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
    console.log(`${row.id}: ${row.info}`);
  });
});

db.close();
