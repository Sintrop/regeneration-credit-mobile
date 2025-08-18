import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import { FeedDBProps, ResourcesTypes } from '@database';

SQLite.enablePromise(true);

let db: SQLiteDatabase;

async function openDB() {
  if (db) return db; // reutiliza conexão se já estiver aberta
  db = await SQLite.openDatabase({
    name: 'feedrc.db',
    location: "default",
  });
  return db;
};

async function createTable() {
  const database = await openDB();
  const query = `
    CREATE TABLE IF NOT EXISTS Feed (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resource_id INTEGER,
      resource_type TEXT,
      created_at INTEGER
    );
  `;
  await database.executeSql(query);
};

interface InsertResourceFeedProps {
  resourceId: number;
  resourceType: ResourcesTypes;
  createdAt: number;
}
async function insertResourceFeed({ createdAt, resourceId, resourceType }: InsertResourceFeedProps) {
  const database = await openDB();

  const query = `
    INSERT INTO Feed (resource_id, resource_type, created_at)
    VALUES (?, ?, ?);
  `;

  try {
    await database.executeSql(query, [resourceId, resourceType, createdAt]);
  } catch (e) {
    console.log(e)
  }
};

async function getFeed(): Promise<FeedDBProps[]> {
  const database = await openDB();
  const query = `
    SELECT * FROM Feed ORDER BY created_at DESC;
  `;
  const [results] = await database.executeSql(query);
  const registers = [];
  for (let i = 0; i < results.rows.length; i++) {
    registers.push(results.rows.item(i));
  }
  return registers;
};

interface CheckResourceExistsProps {
  resourceType: ResourcesTypes;
  id: number;
}
async function checkResourceExists({ id, resourceType }: CheckResourceExistsProps): Promise<boolean> {
  const database = await openDB();
  const query = `
    SELECT * FROM Feed 
    WHERE resource_id = ?
      AND resource_type = ?
  `;
  const [results] = await database.executeSql(query, [id, resourceType]);
  return results.rows.length > 0 ? true : false;
}


export const database = {
  openDB,
  createTable,
  getFeed,
  insertResourceFeed,
  checkResourceExists
}