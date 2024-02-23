// pouchdb-utils.ts

import PouchDB from 'pouchdb-browser';

const DB_NAME = 'myDatabase';

async function storeDataInPouchDB(data: any[]): Promise<void> {
  console.log('storeDataInPouchDB')
  const db = new PouchDB(DB_NAME);
  await db.bulkDocs(data.map(item => ({ _id: item.id, ...item })));
  await db.close();
}

async function getCachedDataFromPouchDB(): Promise<any[]> {
  console.log('getCachedDataFromPouchDB')
  const db = new PouchDB(DB_NAME);
  const { rows } = await db.allDocs({ include_docs: true });
  await db.close();
  const data = rows.map(row => row.doc);
  return data;
}

export { storeDataInPouchDB, getCachedDataFromPouchDB };