import dbCnx from './db';

// todo: dates shall be unique
const schemas = {
  tables: {
    words: `create table words (
              word varchar(60),
              lang varchar(20),
              frequencyOrder Int not null,
              stage varchar(20) not null,
              audioLink varchar(200),
              types varchar(20),
              synonyms varchar(60),
              definitions varchar(200),
              examples varchar(200),
              unique (lang, frequencyOrder),
              primary key (word, lang)
            );`,
    translations: `create table translations (
                    word varchar(60),
                    srcLang varchar(20),
                    destLang varchar(20),
                    foreign key (word, srcLang) references words(word, lang)
                  );`,
    wordLogs: `create table wordLogs (
                word varchar(60),
                lang varchar(20),
                stage varchar(20),
                date varchar(20) unique,
                foreign key (word, lang) references words(word, lang)
              );`,
  },
  alteringTransaction: {
    open: `
            PRAGMA foreign_keys=off;
            BEGIN TRANSACTION;
            drop table if exists newTempTableName;
            ALTER TABLE $tableName RENAME TO newTempTableName;
          `,
    close: `INSERT INTO $tableName SELECT * FROM newTempTableName;
            drop table if exists newTempTableName;
            COMMIT;
            PRAGMA foreign_keys=on;
           `,
  },
};
type TableNames = keyof (typeof schemas)['tables'];

const exec = ({
  tableName,
  alter,
}: {
  tableName: TableNames;
  alter?: boolean;
}) => {
  console.log(`----- ${alter ? 'altering' : 're-creating'} ${tableName} ----`);
  const query = `
        ${
          alter
            ? schemas.alteringTransaction.open
            : `drop table if exists ${tableName};`
        }
        ${schemas.tables[tableName]};
        ${alter ? schemas.alteringTransaction.close : ``}
    `;
  const parsedQuery = query.replace(/\$tableName/g, tableName);
  console.log(parsedQuery);
  const resp = dbCnx.exec(parsedQuery);
};

function init() {
  const tableNames = Object.keys(schemas.tables) as TableNames[];
  tableNames.forEach((tableName) => {
    exec({ tableName });
  });
}

function update() {
  const tableNames = Object.keys(schemas.tables) as TableNames[];
  tableNames.forEach((tableName) => {
    exec({ tableName, alter: true });
  });
}

export default { init, update };
