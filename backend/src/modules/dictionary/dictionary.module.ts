import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KdWord } from '../../database/entities/kd_word.entity';
import { KdWordType } from '../../database/entities/kd_word_type.entity';
import { KdPhrase } from '../../database/entities/kd_phrase.entity';
import { KdExample } from '../../database/entities/kd_example.entity';
import { KdUser } from '../../database/entities/kd_user.entity';
import { DictionaryController } from './dictionary.controller';
import { DictionaryService } from './dictionary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([KdWord, KdWordType, KdPhrase, KdExample, KdUser]),
  ],
  controllers: [DictionaryController],
  providers: [DictionaryService],
  exports: [DictionaryService],
})
export class DictionaryModule {}
