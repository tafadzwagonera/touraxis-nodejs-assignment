import { ConfigModule, ConfigService } from '@nestjs/config'
import { EntityGenerator } from '@mikro-orm/entity-generator'
import { Logger, Module } from '@nestjs/common'
import { Migrator } from '@mikro-orm/migrations-mongodb'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { MongoDriver } from '@mikro-orm/mongodb'
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter'
import { SeedManager } from '@mikro-orm/seeder'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import env from 'config/env.config'
import NodeEnv from 'common/enums/node-env.enum'

const isProd =
  env.get('NODE_ENV') === NodeEnv.Prd || env.get('NODE_ENV') === NodeEnv.Stg

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        allowGlobalContext: env.get('NODE_ENV') === NodeEnv.Tst,
        clientUrl: configService.get<string>('MONGODB_URI'),
        debug: !isProd,
        discovery: { warnWhenNoEntities: false },
        driver: MongoDriver,
        ensureIndexes: true,
        entities: ['./dist/entities'],
        entitiesTs: ['./src/entities'],
        extensions: [Migrator, EntityGenerator, SeedManager],
        highlighter: new MongoHighlighter(),
        logger: (message: string) => Logger.log(message),
        metadataProvider: TsMorphMetadataProvider,
      }),
    }),
  ],
})
export class DatabaseModule {}
