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
import { KdWordType } from './kd_word_type.entity';
import { KdPhrase } from './kd_phrase.entity';
import { KdExample } from './kd_example.entity';
import { KdBookmark } from './kd_bookmark.entity';

export enum ContentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('kd_words')
export class KdWord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  word_koho: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  word_koho_normalized: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phonetic: string;

  @Column({ type: 'int', nullable: true })
  word_type_id: number;

  @ManyToOne(() => KdWordType, (type) => type.words, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'word_type_id' })
  word_type: KdWordType;

  @Index()
  @Column({ type: 'varchar', length: 500 })
  meaning_vi: string;

  @Column({ type: 'text', nullable: true })
  definition_vi: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  audio_url: string;

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

  @Column({ type: 'int', default: 0 })
  view_count: number;

  @OneToMany(() => KdPhrase, (phrase) => phrase.word, { cascade: true })
  phrases: KdPhrase[];

  @OneToMany(() => KdExample, (example) => example.word, { cascade: true })
  examples: KdExample[];

  @OneToMany(() => KdBookmark, (bookmark) => bookmark.word)
  bookmarks: KdBookmark[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
