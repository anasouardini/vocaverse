import { Database } from './dbTypes.ts' // this is the Database interface we defined earlier
import * as SQLite from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'

const dialect = new SqliteDialect({
  database: new SQLite(':memory:'),
})

export default new Kysely<Database>({
  dialect,
})