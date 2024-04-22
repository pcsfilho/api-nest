import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'Cn}"FT~65DuVB8R,;~As<7e$A#_ZSj:B',
    }),
  ],
})
export class AuthModule {}
