import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KdUser, UserRole } from '../../database/entities/kd_user.entity';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    @InjectRepository(KdUser)
    private readonly userRepository: Repository<KdUser>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Thiếu mã xác thực phiên đăng nhập (Bearer token)');
    }

    const token = authHeader.split(' ')[1];

    try {
      // Giải mã Payload từ JWT token của Supabase Auth
      const payloadBase64 = token.split('.')[1];
      const decodedJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
      const payload = JSON.parse(decodedJson);

      const userId = payload.sub;
      const email = payload.email || payload.user_metadata?.email;
      const fullName = payload.user_metadata?.full_name || payload.user_metadata?.name || '';
      const avatarUrl = payload.user_metadata?.avatar_url || payload.user_metadata?.picture || null;

      if (!userId || !email) {
        throw new UnauthorizedException('Mã xác thực không hợp lệ hoặc đã hết hạn');
      }

      // Kiểm tra hoặc tự động tạo tài khoản trong kd_users
      let user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        const adminEmail = process.env.ADMIN_EMAIL || '';
        const initialRole = email.toLowerCase() === adminEmail.toLowerCase()
          ? UserRole.ADMIN
          : UserRole.USER;

        user = this.userRepository.create({
          id: userId,
          email,
          full_name: fullName,
          avatar_url: avatarUrl,
          role: initialRole,
          is_active: true,
        });

        await this.userRepository.save(user);
      } else {
        // Cập nhật thông tin avatar hoặc full_name nếu có thay đổi từ Google
        if (fullName && user.full_name !== fullName) user.full_name = fullName;
        if (avatarUrl && user.avatar_url !== avatarUrl) user.avatar_url = avatarUrl;
        await this.userRepository.save(user);
      }

      if (!user.is_active) {
        throw new UnauthorizedException('Tài khoản của bạn đã bị khóa bởi Quản trị viên');
      }

      // Gắn đối tượng user vào request
      request.user = user;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ');
    }
  }
}
