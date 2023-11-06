import { useState, useEffect } from 'react';
import { SQLiteDBConnection } from "@capacitor-community/sqlite";

export const useQuerySQLite = (db: SQLiteDBConnection | null, stmt: string, values: any[]) => {
    const fetchData = async () => {
        if (db) {
            try {
                const data = await db.query(stmt, values);
                return data.values as never[];
            } catch (err: any) {
                const msg = err.message ? err.message : err;
                throw new Error(`useQuerySQLite: ${msg}`);
            }
        }
        return [];
    };
    return fetchData;
};