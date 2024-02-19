import { DataSource , type DataSourceOptions} from 'typeorm';
import sqliteParams from '../sqliteParams';
import * as entities from '../entities/user';
import * as migrations from '../migrations/user';

// User Database Name
const dbName = "react-sqlite-user"

const dataSourceConfig: DataSourceOptions = {
  name: 'userConnection',
  type: 'capacitor',
  driver: sqliteParams.connection,
  database: dbName,
  mode: 'no-encryption',
  entities: entities,
  migrations: migrations, // ["../migrations/user/*.{js,ts}"],
  subscribers: [],
  logging: [/*'query',*/ 'error','schema'],
  synchronize: false,     // !!!You will lose all data in database if set to `true`
  migrationsRun: false
};
export const dataSourceUser = new DataSource(dataSourceConfig);
const userDataSource = {
  dataSource: dataSourceUser,
  dbName: dbName
};
export default userDataSource;
