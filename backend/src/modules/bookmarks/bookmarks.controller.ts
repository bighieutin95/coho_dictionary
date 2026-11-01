import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('bookmarks')
@UseGuards(SupabaseAuthGuard)
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  async getMyBookmarks(@Request() req) {
    const data = await this.bookmarksService.getUserBookmarks(req.user.id);
    return {
      statusCode: 200,
      data,
    };
  }

  @Post('toggle')
  async toggleBookmark(@Body('word_id') wordId: string, @Request() req) {
    const data = await this.bookmarksService.toggleBookmark(req.user.id, wordId);
    return {
      statusCode: 200,
      data,
    };
  }

  @Get('check/:wordId')
  async checkBookmarked(@Param('wordId') wordId: string, @Request() req) {
    const isBookmarked = await this.bookmarksService.checkIsBookmarked(req.user.id, wordId);
    return {
      statusCode: 200,
      data: { is_bookmarked: isBookmarked },
    };
  }
}
