import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { KdUser } from './kd_user.entity';
import { KdWord } from './kd_word.entity';

@Entity('kd_bookmarks')
@Unique(['user_id', 'word_id'])
export class KdBookmark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => KdUser, (user) => user.bookmarks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: KdUser;

  @Column({ type: 'uuid' })
  word_id: string;

  @ManyToOne(() => KdWord, (word) => word.bookmarks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'word_id' })
  word: KdWord;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
