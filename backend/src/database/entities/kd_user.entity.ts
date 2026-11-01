import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { KdBookmark } from './kd_bookmark.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  CONTRIBUTOR = 'CONTRIBUTOR',
  USER = 'USER',
}

@Entity('kd_users')
export class KdUser {
  @PrimaryColumn('uuid')
  id: string; // Trùng với auth.users.id của Supabase

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  full_name: string;

  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToMany(() => KdBookmark, (bookmark) => bookmark.user)
  bookmarks: KdBookmark[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
