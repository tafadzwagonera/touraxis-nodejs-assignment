import {
  defineConfig,
  EntityCaseNamingStrategy,
  MongoDriver,
} from '@mikro-orm/mongodb'
import { EntityGenerator } from '@mikro-orm/entity-generator'
import { Logger } from '@nestjs/common'
import { Migrator } from '@mikro-orm/migrations-mongodb'
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter'
import { SeedManager } from '@mikro-orm/seeder'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import env from '../config/env.config'
import NodeEnv from '../common/enums/node-env.enum'

const isProd =
  env.get('NODE_ENV') === NodeEnv.Prd || env.get('NODE_ENV') === NodeEnv.Stg

export default defineConfig({
  allowGlobalContext: env.get('NODE_ENV') === NodeEnv.Tst,
  clientUrl: env.get('MONGODB_URI') as string,
  debug: !isProd,
  discovery: { warnWhenNoEntities: false },
  driver: MongoDriver,
  ensureIndexes: true,
  entities: ['./dist/src/entities'],
  entitiesTs: ['./src/entities'],
  extensions: [Migrator, EntityGenerator, SeedManager],
  highlighter: new MongoHighlighter(),
  logger: (message: string) => Logger.log(message),
  metadataProvider: TsMorphMetadataProvider,
  namingStrategy: EntityCaseNamingStrategy,
})
