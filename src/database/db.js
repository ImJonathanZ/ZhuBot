const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "../../data/food_places.db"));

db.exec(`
    CREATE TABLE IF NOT EXISTS food_places (
        id                INTEGER PRIMARY KEY AUTOINCREMENT,
        instagram_url     TEXT UNIQUE NOT NULL,
        instagram_handle  TEXT,
        restaurant_name   TEXT,
        caption           TEXT,
        thumbnail_url     TEXT,
        google_place_id   TEXT,
        address           TEXT,
        rating            REAL,
        review_count      INTEGER,
        price_level       TEXT,
        maps_url          TEXT,
        discord_user_id   TEXT,
        discord_channel_id TEXT,
        created_at        TEXT NOT NULL
    )
`);

const insert = db.prepare(`
    INSERT OR IGNORE INTO food_places
        (instagram_url, instagram_handle, restaurant_name, caption, thumbnail_url,
         google_place_id, address, rating, review_count, price_level, maps_url,
         discord_user_id, discord_channel_id, created_at)
    VALUES
        (@instagram_url, @instagram_handle, @restaurant_name, @caption, @thumbnail_url,
         @google_place_id, @address, @rating, @review_count, @price_level, @maps_url,
         @discord_user_id, @discord_channel_id, @created_at)
`);

const insertFoodPlace = (data) => {
    insert.run({ ...data, created_at: new Date().toISOString() });
};

module.exports = { db, insertFoodPlace };
