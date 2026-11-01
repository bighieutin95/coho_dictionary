import { IsNotEmpty, IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class CreatePhraseDto {
  @IsNotEmpty({ message: 'Cụm từ K\'Ho không được để trống' })
  @IsString()
  phrase_koho: string;

  @IsOptional()
  @IsString()
  phonetic?: string;

  @IsNotEmpty({ message: 'Nghĩa tiếng Việt của cụm từ không được để trống' })
  @IsString()
  meaning_vi: string;

  @IsOptional()
  @IsString()
  explanation_vi?: string;
}

export class CreateExampleDto {
  @IsNotEmpty({ message: 'Câu ví dụ tiếng K\'Ho không được để trống' })
  @IsString()
  sentence_koho: string;

  @IsNotEmpty({ message: 'Dịch nghĩa câu ví dụ không được để trống' })
  @IsString()
  sentence_vi: string;
}

export class CreateWordDto {
  @IsNotEmpty({ message: 'Từ vựng K\'Ho không được để trống' })
  @IsString()
  word_koho: string;

  @IsOptional()
  @IsString()
  phonetic?: string;

  @IsOptional()
  @IsNumber()
  word_type_id?: number;

  @IsNotEmpty({ message: 'Nghĩa tiếng Việt không được để trống' })
  @IsString()
  meaning_vi: string;

  @IsOptional()
  @IsString()
  definition_vi?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  audio_url?: string;

  @IsOptional()
  @IsArray()
  phrases?: CreatePhraseDto[];

  @IsOptional()
  @IsArray()
  examples?: CreateExampleDto[];
}
