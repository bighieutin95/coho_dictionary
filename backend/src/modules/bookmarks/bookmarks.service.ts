import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KdBookmark } from '../../database/entities/kd_bookmark.entity';
import { KdWord } from '../../database/entities/kd_word.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(KdBookmark)
    private readonly bookmarkRepository: Repository<KdBookmark>,
    @InjectRepository(KdWord)
    private readonly wordRepository: Repository<KdWord>,
  ) {}

  async getUserBookmarks(userId: string) {
    const bookmarks = await this.bookmarkRepository.find({
      where: { user_id: userId },
      relations: ['word', 'word.word_type'],
      order: { created_at: 'DESC' },
    });
    return bookmarks.map((b) => b.word).filter(Boolean);
  }

  async toggleBookmark(userId: string, wordId: string): Promise<{ is_bookmarked: boolean }> {
    const word = await this.wordRepository.findOne({ where: { id: wordId } });
    if (!word) {
      throw new NotFoundException('Không tìm thấy từ ngữ này');
    }

    const existing = await this.bookmarkRepository.findOne({
      where: { user_id: userId, word_id: wordId },
    });

    if (existing) {
      await this.bookmarkRepository.delete(existing.id);
      return { is_bookmarked: false };
    } else {
      const newBookmark = this.bookmarkRepository.create({
        user_id: userId,
        word_id: wordId,
      });
      await this.bookmarkRepository.save(newBookmark);
      return { is_bookmarked: true };
    }
  }

  async checkIsBookmarked(userId: string, wordId: string): Promise<boolean> {
    const count = await this.bookmarkRepository.count({
      where: { user_id: userId, word_id: wordId },
    });
    return count > 0;
  }
}
