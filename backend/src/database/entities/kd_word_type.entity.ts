import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { KdWord } from './kd_word.entity';

@Entity('kd_word_types')
export class KdWordType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string; // d, đ, t, đt, pt...

  @Column({ type: 'varchar', length: 100 })
  name_vi: string; // Danh từ, Động từ, Tính từ...

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  order_index: number;

  @OneToMany(() => KdWord, (word) => word.word_type)
  words: KdWord[];
}
