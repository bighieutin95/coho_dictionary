import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { KdWord, ContentStatus } from './kd_word.entity';
import { KdExample } from './kd_example.entity';

@Entity('kd_phrases')
export class KdPhrase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  phrase_koho: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  phrase_koho_normalized: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phonetic: string;

  @Column({ type: 'varchar', length: 500 })
  meaning_vi: string;

  @Column({ type: 'text', nullable: true })
  explanation_vi: string;

  @Column({ type: 'uuid', nullable: true })
  word_id: string;

  @ManyToOne(() => KdWord, (word) => word.phrases, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'word_id' })
  word: KdWord;

  @Column({
    type: 'varchar',
    length: 20,
    default: ContentStatus.APPROVED,
  })
  status: ContentStatus;

  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @Column({ type: 'uuid', nullable: true })
  reviewed_by: string;

  @OneToMany(() => KdExample, (example) => example.phrase, { cascade: true })
  examples: KdExample[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
