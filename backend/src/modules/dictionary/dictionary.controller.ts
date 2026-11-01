import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../../database/entities/kd_user.entity';
import { ContentStatus } from '../../database/entities/kd_word.entity';
import { CreateWordDto } from './dto/create-word.dto';

@Controller()
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Get('word-types')
  async getWordTypes() {
    const data = await this.dictionaryService.getAllWordTypes();
    return {
      statusCode: 200,
      data,
    };
  }

  @Get('words/search')
  async searchWords(
    @Query('q') q?: string,
    @Query('direction') direction?: 'koho_vi' | 'vi_koho',
    @Query('type') type?: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.dictionaryService.searchWords({
      q,
      direction,
      type,
      page,
      limit,
    });
    return {
      statusCode: 200,
      ...result,
    };
  }

  @Get('words/:id')
  async getWordDetail(@Param('id') id: string) {
    const data = await this.dictionaryService.getWordById(id);
    return {
      statusCode: 200,
      data,
    };
  }

  @Post('words')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(UserRole.CONTRIBUTOR, UserRole.MODERATOR, UserRole.ADMIN)
  async createWord(@Body() dto: CreateWordDto, @Request() req) {
    const data = await this.dictionaryService.createWord(dto, req.user);
    return {
      statusCode: 201,
      message: 'Thêm từ mới thành công',
      data,
    };
  }

  @Put('words/:id')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  async updateWord(@Param('id') id: string, @Body() dto: Partial<CreateWordDto>) {
    const data = await this.dictionaryService.updateWord(id, dto);
    return {
      statusCode: 200,
      message: 'Cập nhật từ ngữ thành công',
      data,
    };
  }

  @Patch('words/:id/status')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ContentStatus,
    @Request() req,
  ) {
    const data = await this.dictionaryService.updateWordStatus(id, status, req.user.id);
    return {
      statusCode: 200,
      message: 'Cập nhật trạng thái duyệt bài thành công',
      data,
    };
  }

  @Delete('words/:id')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteWord(@Param('id') id: string) {
    await this.dictionaryService.deleteWord(id);
    return {
      statusCode: 200,
      message: 'Xóa từ ngữ thành công',
    };
  }

  @Get('contributions/pending')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  async getPendingContributions() {
    const data = await this.dictionaryService.getPendingContributions();
    return {
      statusCode: 200,
      data,
    };
  }

  @Get('stats')
  async getStats() {
    const data = await this.dictionaryService.getStatistics();
    return {
      statusCode: 200,
      data,
    };
  }
}
