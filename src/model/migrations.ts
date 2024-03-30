import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('word')
        .addColumn('word', 'text', (col) => col.notNull())
        .addColumn('lang', 'text', (col) => col.notNull())
        .addColumn('audioLink', 'text')
        .addColumn('frequency', 'integer', (col) => col.notNull())
        .addColumn('stage', 'text', (col) => col.notNull())
        .addColumn('types', 'text', (col) => col.notNull())
        .addColumn('synonyms', 'text', (col) => col.notNull())
        .addColumn('definitions', 'text', (col) => col.notNull())
        .addColumn('examples', 'text', (col) => col.notNull())
        .addPrimaryKeyConstraint('word_PK', ['word', 'lang'])
        .execute()

    await db.schema
        .createTable('translation')
        .addColumn('word', 'text', (col) => col.notNull())
        .addColumn('srcLang', 'text', (col) => col.notNull())
        .addColumn('destLang', 'text', (col) => col.notNull())
        .addColumn('translations', 'text', (col) => col.notNull())
        .addForeignKeyConstraint('word_translation_FK', ['word', 'srcLang'], 'word', ['word', 'lang'])
        .execute()

    await db.schema
        .createTable('wordLog')
        .addColumn('word', 'text', (col) => col.notNull())
        .addColumn('lang', 'text', (col) => col.notNull())
        .addColumn('date', 'text', (col) => col.notNull())
        .addForeignKeyConstraint('word_log_FK', ['word', 'lang'], 'word', ['word', 'lang'])
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('wordLog').execute()
    //! don't drop words and translations
}