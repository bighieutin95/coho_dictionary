import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DictionaryModule } from './modules/dictionary/dictionary.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import {
  KdUser,
  KdWordType,
  KdWord,
  KdPhrase,
  KdExample,
  KdBookmark,
  KdSearchHistory,
} from './database/entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        return {
          type: 'postgres',
          url: databaseUrl,
          entities: [
            KdUser,
            KdWordType,
            KdWord,
            KdPhrase,
            KdExample,
            KdBookmark,
            KdSearchHistory,
          ],
          synchronize: false, // Sử dụng migrations/init_schema.sql để quản lý schema an toàn
          ssl: databaseUrl ? { rejectUnauthorized: false } : false,
          autoLoadEntities: true,
        };
      },
    }),
    AuthModule,
    UsersModule,
    DictionaryModule,
    BookmarksModule,
  ],
})
export class AppModule {}
