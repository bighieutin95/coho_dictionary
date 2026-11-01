import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KdUser } from '../../database/entities/kd_user.entity';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import { RolesGuard } from './roles.guard';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([KdUser])],
  providers: [SupabaseAuthGuard, RolesGuard],
  exports: [SupabaseAuthGuard, RolesGuard, TypeOrmModule],
})
export class AuthModule {}
