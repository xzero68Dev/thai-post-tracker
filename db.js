const sqlite3 = require('sqlite3');
const { open } = require('sqlite');


let db;


async function getDB() {
if (!db) {
db = await open({
filename: './database.sqlite',
driver: sqlite3.Database
});


await db.exec(`
CREATE TABLE IF NOT EXISTS parcels (
id INTEGER PRIMARY KEY AUTOINCREMENT,
track_code TEXT UNIQUE,
last_status TEXT,
last_update TEXT,
delivered INTEGER DEFAULT 0,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);
}
return db;
}


module.exports = { getDB };