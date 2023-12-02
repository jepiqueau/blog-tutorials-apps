import { SQLiteDBConnection } from '@capacitor-community/sqlite';

export const useQuerySQLite = async (
  db: SQLiteDBConnection,
  stmt: string,
  values: never[]
) => {
  if (db) {
    try {
      const queryResult = await db.query(stmt, values);
      return queryResult.values as never[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err.message ? err.message : err;
      throw new Error(`useQuerySQLite: ${msg}`);
    }
  }
  return [];
};
