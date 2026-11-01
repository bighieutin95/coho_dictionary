import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { KdUser, UserRole } from '../../database/entities/kd_user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(KdUser)
    private readonly userRepository: Repository<KdUser>,
  ) {}

  async getProfile(userId: string): Promise<KdUser> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return user;
  }

  async findAll(query: { q?: string; role?: string; page?: number; limit?: number }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (query.q) {
      queryBuilder.where(
        '(LOWER(user.email) LIKE LOWER(:q) OR LOWER(user.full_name) LIKE LOWER(:q))',
        { q: `%${query.q}%` },
      );
    }

    if (query.role) {
      queryBuilder.andWhere('user.role = :role', { role: query.role });
    }

    queryBuilder.orderBy('user.created_at', 'DESC').skip(skip).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateRole(userId: string, newRole: UserRole, currentAdminId: string): Promise<KdUser> {
    if (!Object.values(UserRole).includes(newRole)) {
      throw new BadRequestException('Vai trò không hợp lệ');
    }

    const targetUser = await this.userRepository.findOne({ where: { id: userId } });
    if (!targetUser) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    if (targetUser.id === currentAdminId && newRole !== UserRole.ADMIN) {
      throw new BadRequestException('Bạn không thể tự hạ quyền Admin của chính mình');
    }

    targetUser.role = newRole;
    return await this.userRepository.save(targetUser);
  }

  async toggleStatus(userId: string, currentAdminId: string): Promise<KdUser> {
    const targetUser = await this.userRepository.findOne({ where: { id: userId } });
    if (!targetUser) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    if (targetUser.id === currentAdminId) {
      throw new BadRequestException('Bạn không thể tự khóa tài khoản của chính mình');
    }

    targetUser.is_active = !targetUser.is_active;
    return await this.userRepository.save(targetUser);
  }
}
