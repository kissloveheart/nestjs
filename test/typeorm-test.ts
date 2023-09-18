import { MongoMemoryServer } from 'mongodb-memory-server';
import { DataSource, getMetadataArgsStorage } from 'typeorm';

let mongo: MongoMemoryServer;
let dataSource: DataSource;

export const initialTypeOrm = async () => {
  if (dataSource?.isInitialized) return dataSource;
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  dataSource = new DataSource({
    type: 'mongodb',
    url: mongoUri,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    synchronize: false,
    migrationsRun: false,
    retryWrites: false,
    entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  });

  return await dataSource.initialize();
};

export const closeMongoConnection = async () => {
  if (dataSource?.isInitialized) await dataSource.destroy();
  if (mongo) await mongo.stop();
};
