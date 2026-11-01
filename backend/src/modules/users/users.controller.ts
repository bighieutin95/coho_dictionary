import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../../database/entities/kd_user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  async getMe(@Request() req) {
    return {
      statusCode: 200,
      data: req.user,
    };
  }

  @Get()
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllUsers(
    @Query('q') q?: string,
    @Query('role') role?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.usersService.findAll({ q, role, page, limit });
    return {
      statusCode: 200,
      ...result,
    };
  }

  @Patch(':id/role')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateUserRole(
    @Param('id') id: string,
    @Body('role') role: UserRole,
    @Request() req,
  ) {
    const updated = await this.usersService.updateRole(id, role, req.user.id);
    return {
      statusCode: 200,
      message: 'Cập nhật phân quyền thành công',
      data: updated,
    };
  }

  @Patch(':id/status')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async toggleUserStatus(@Param('id') id: string, @Request() req) {
    const updated = await this.usersService.toggleStatus(id, req.user.id);
    return {
      statusCode: 200,
      message: 'Thay đổi trạng thái tài khoản thành công',
      data: updated,
    };
  }
}
