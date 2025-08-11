import SQLite, { SQLiteDatabase, ResultSet, Transaction } from 'react-native-sqlite-storage';

SQLite.enablePromise(false);

async function initDB(): Promise<SQLiteDatabase> {
  return await SQLite.openDatabase({
    name: 'feed.db',
    location: 'default',
  });
}

async function createTables(): Promise<void> {
  const db = await initDB();
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS feed (
          id INTEGER PRIMARY KEY NOT NULL,
          userAddress TEXT
          contractAddress TEXT,
          createdAt INTEGER,
          type TEXT,
          data TEXT
        );`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS totalTypes (
          type TEXT PRIMARY KEY NOT NULL
          contractAddress TEXT,
          total INTEGER
        );`
    );
  })
}

interface UpdateTotalTypeProps {
  contractAddress: string;
  type: string;
  total: number;
}
async function updateTotalType({ contractAddress, total, type }: UpdateTotalTypeProps): Promise<void> {
  const db = await initDB();
  db.transaction((tx: Transaction) => {
    tx.executeSql(
      `INSERT OR REPLACE INTO totalTypes (type, contractAddress, total) VALUES (?, ?, ?);`,
      [type, contractAddress, total]
    );
  });
}

async function getTotalType(type: string): Promise<number> {
  return new Promise(async (resolve, reject) => {
    const db = await initDB()
    db.transaction((tx: Transaction) => {
      tx.executeSql(
        `SELECT total FROM totalTypes WHERE type = ?;`,
        [type],
        (_: Transaction, results: ResultSet) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0).total);
          } else {
            resolve(0);
          }
        },
        (_: Transaction, error: Error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export const feedDB = {
  createTables,
  updateTotalType,
  getTotalType
}