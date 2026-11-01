import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { KdUser } from './kd_user.entity';

@Entity('kd_search_history')
export class KdSearchHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  user_id: string;

  @ManyToOne(() => KdUser, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: KdUser;

  @Column({ type: 'varchar', length: 255 })
  keyword: string;

  @Column({ type: 'varchar', length: 20, default: 'koho_vi' })
  target_lang: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
