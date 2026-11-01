import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { KdWord } from './kd_word.entity';
import { KdPhrase } from './kd_phrase.entity';

@Entity('kd_examples')
export class KdExample {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  sentence_koho: string;

  @Column({ type: 'text' })
  sentence_vi: string;

  @Column({ type: 'uuid', nullable: true })
  word_id: string;

  @ManyToOne(() => KdWord, (word) => word.examples, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'word_id' })
  word: KdWord;

  @Column({ type: 'uuid', nullable: true })
  phrase_id: string;

  @ManyToOne(() => KdPhrase, (phrase) => phrase.examples, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'phrase_id' })
  phrase: KdPhrase;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
