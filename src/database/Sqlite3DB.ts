import {Database} from "sqlite3";

export class Sqlite3DB {

    private readonly database: Database;


    private constructor(database: Database) {
        this.database = database;
    }

    public static initAwfDB(dbPath: string) {
        return new Sqlite3DB(new Database(dbPath));
    }

    public query(sql: string): Promise<[]> {
        return new Promise((resolve, reject) => {
            if (!this.database) {
                return reject(new Error('Database.get: database is not open'));
            }
            const records: any = []
            this.database.each(sql, (err, row) => {
                if (err) reject(err)
                records.push(row)
            }, (err) => {
                if (err) reject(err)
                resolve(records)
            });
        })
    }

    public close() {
        this.database.close()
    }
}