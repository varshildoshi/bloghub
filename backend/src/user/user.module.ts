import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { UserController } from './controller/user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { EmailVerification } from './models/emailverification.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EmailVerification]),
    AuthModule,
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: 'smtp.gmail.com',
          auth: {
            user: 'bloghubapp@gmail.com',
            pass: 'orkm vkax lfnb kano'
          },
        },
        defaults: {
          from: `BlogHub <bloghubapp@gmail.com>`,
        },
        template: {
          dir: join(__dirname, './service/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        }
      }),
    })
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule { }
