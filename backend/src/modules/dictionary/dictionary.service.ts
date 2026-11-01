import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { KdWord, ContentStatus } from '../../database/entities/kd_word.entity';
import { KdWordType } from '../../database/entities/kd_word_type.entity';
import { KdPhrase } from '../../database/entities/kd_phrase.entity';
import { KdExample } from '../../database/entities/kd_example.entity';
import { KdUser, UserRole } from '../../database/entities/kd_user.entity';
import { CreateWordDto } from './dto/create-word.dto';
import { normalizeKohoText } from './utils/normalize.util';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectRepository(KdWord)
    private readonly wordRepository: Repository<KdWord>,
    @InjectRepository(KdWordType)
    private readonly wordTypeRepository: Repository<KdWordType>,
    @InjectRepository(KdPhrase)
    private readonly phraseRepository: Repository<KdPhrase>,
    @InjectRepository(KdExample)
    private readonly exampleRepository: Repository<KdExample>,
    @InjectRepository(KdUser)
    private readonly userRepository: Repository<KdUser>,
  ) {}

  async getAllWordTypes(): Promise<KdWordType[]> {
    return await this.wordTypeRepository.find({
      order: { order_index: 'ASC' },
    });
  }

  async searchWords(query: {
    q?: string;
    direction?: 'koho_vi' | 'vi_koho';
    type?: number;
    status?: ContentStatus;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;
    const direction = query.direction || 'koho_vi';
    const status = query.status || ContentStatus.APPROVED;

    const queryBuilder = this.wordRepository
      .createQueryBuilder('word')
      .leftJoinAndSelect('word.word_type', 'word_type')
      .leftJoinAndSelect('word.phrases', 'phrases')
      .leftJoinAndSelect('word.examples', 'examples')
      .where('word.status = :status', { status });

    if (query.type) {
      queryBuilder.andWhere('word.word_type_id = :typeId', { typeId: query.type });
    }

    if (query.q && query.q.trim()) {
      const rawQuery = query.q.trim();
      const normalizedQuery = normalizeKohoText(rawQuery);

      if (direction === 'koho_vi') {
        queryBuilder.andWhere(
          '(LOWER(word.word_koho) LIKE LOWER(:raw) OR word.word_koho_normalized LIKE :norm)',
          {
            raw: `%${rawQuery}%`,
            norm: `%${normalizedQuery}%`,
          },
        );
      } else {
        // Hướng Việt -> K'Ho
        queryBuilder.andWhere(
          '(LOWER(word.meaning_vi) LIKE LOWER(:raw) OR LOWER(word.definition_vi) LIKE LOWER(:raw))',
          { raw: `%${rawQuery}%` },
        );
      }
    }

    queryBuilder.orderBy('word.word_koho', 'ASC').skip(skip).take(limit);

    const [words, total] = await queryBuilder.getManyAndCount();

    return {
      data: words,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getWordById(id: string): Promise<KdWord> {
    const word = await this.wordRepository.findOne({
      where: { id },
      relations: ['word_type', 'phrases', 'examples'],
    });

    if (!word) {
      throw new NotFoundException('Không tìm thấy từ ngữ này trong từ điển');
    }

    // Tăng lượt xem
    await this.wordRepository.increment({ id }, 'view_count', 1);

    return word;
  }

  async createWord(dto: CreateWordDto, user: KdUser): Promise<KdWord> {
    const isAutoApproved = user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR;
    const initialStatus = isAutoApproved ? ContentStatus.APPROVED : ContentStatus.PENDING;

    const word = this.wordRepository.create({
      word_koho: dto.word_koho.trim(),
      word_koho_normalized: normalizeKohoText(dto.word_koho),
      phonetic: dto.phonetic?.trim() || null,
      word_type_id: dto.word_type_id || null,
      meaning_vi: dto.meaning_vi.trim(),
      definition_vi: dto.definition_vi?.trim() || null,
      notes: dto.notes?.trim() || null,
      audio_url: dto.audio_url || null,
      status: initialStatus,
      created_by: user.id,
      reviewed_by: isAutoApproved ? user.id : null,
    });

    const savedWord = await this.wordRepository.save(word);

    // Lưu các cụm từ đính kèm
    if (dto.phrases && dto.phrases.length > 0) {
      const phrases = dto.phrases.map((p) =>
        this.phraseRepository.create({
          phrase_koho: p.phrase_koho.trim(),
          phrase_koho_normalized: normalizeKohoText(p.phrase_koho),
          phonetic: p.phonetic?.trim() || null,
          meaning_vi: p.meaning_vi.trim(),
          explanation_vi: p.explanation_vi?.trim() || null,
          word_id: savedWord.id,
          status: initialStatus,
          created_by: user.id,
        }),
      );
      await this.phraseRepository.save(phrases);
    }

    // Lưu các câu ví dụ đính kèm
    if (dto.examples && dto.examples.length > 0) {
      const examples = dto.examples.map((e) =>
        this.exampleRepository.create({
          sentence_koho: e.sentence_koho.trim(),
          sentence_vi: e.sentence_vi.trim(),
          word_id: savedWord.id,
        }),
      );
      await this.exampleRepository.save(examples);
    }

    return await this.getWordById(savedWord.id);
  }

  async updateWord(id: string, dto: Partial<CreateWordDto>): Promise<KdWord> {
    const word = await this.wordRepository.findOne({ where: { id } });
    if (!word) {
      throw new NotFoundException('Không tìm thấy từ ngữ để cập nhật');
    }

    if (dto.word_koho) {
      word.word_koho = dto.word_koho.trim();
      word.word_koho_normalized = normalizeKohoText(dto.word_koho);
    }
    if (dto.phonetic !== undefined) word.phonetic = dto.phonetic;
    if (dto.word_type_id !== undefined) word.word_type_id = dto.word_type_id;
    if (dto.meaning_vi) word.meaning_vi = dto.meaning_vi.trim();
    if (dto.definition_vi !== undefined) word.definition_vi = dto.definition_vi;
    if (dto.notes !== undefined) word.notes = dto.notes;
    if (dto.audio_url !== undefined) word.audio_url = dto.audio_url;

    await this.wordRepository.save(word);
    return await this.getWordById(id);
  }

  async updateWordStatus(id: string, status: ContentStatus, reviewerId: string): Promise<KdWord> {
    const word = await this.wordRepository.findOne({ where: { id } });
    if (!word) {
      throw new NotFoundException('Không tìm thấy từ ngữ');
    }

    word.status = status;
    word.reviewed_by = reviewerId;
    await this.wordRepository.save(word);

    // Cập nhật trạng thái các cụm từ liên quan
    await this.phraseRepository.update({ word_id: id }, { status });

    return word;
  }

  async deleteWord(id: string): Promise<void> {
    const result = await this.wordRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Không tìm thấy từ ngữ cần xóa');
    }
  }

  async getPendingContributions() {
    return await this.wordRepository.find({
      where: { status: ContentStatus.PENDING },
      relations: ['word_type', 'phrases', 'examples'],
      order: { created_at: 'DESC' },
    });
  }

  async getStatistics() {
    const totalWords = await this.wordRepository.count({
      where: { status: ContentStatus.APPROVED },
    });
    const totalPhrases = await this.phraseRepository.count({
      where: { status: ContentStatus.APPROVED },
    });
    const totalUsers = await this.userRepository.count();
    const pendingContributions = await this.wordRepository.count({
      where: { status: ContentStatus.PENDING },
    });

    return {
      totalWords,
      totalPhrases,
      totalUsers,
      pendingContributions,
    };
  }
}
