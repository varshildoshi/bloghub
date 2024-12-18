import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserInterface, UserRole } from '../models/user.interface';
import { catchError, from, map, Observable, of, tap } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
import { UserIsUserGuard } from 'src/auth/guards/userIsUser-guard';
import { VERIFY_EMAIL_STATUS } from '../models/user.const';

export const storage = {
    storage: diskStorage({
        destination: './uploads/profileimages',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`)
        }
    })
}

@Controller('users')
export class UserController {

    constructor(private userService: UserService) {
    }

    @Post('register')
    // @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Body() user: UserInterface): Promise<any> {
        try {
            let newUser = await this.userService.create(user);
            return await newUser.pipe(
                map(async (user: UserInterface) => {
                    await this.userService.createEmailToken(user.email);
                    let sent = await this.userService.sendEmailVerification(user.email);
                    if (sent) {
                        return { message: 'Verification Mail Sent Successfully on your registered mail id', email_verification_sent: sent };
                    } else {
                        return { message: 'Mail not sent', email_verification_sent: sent };
                    }
                })
            )
        } catch (error) {
            return 'Something went wrong';
        }
    }

    @Post('login')
    async login(@Body() user: UserInterface): Promise<any> {
        // return (await this.userService.login(user)).pipe(
        //     map((jwt: string) => {
        //         return { access_token: jwt };
        //     })
        // )

        return (await this.userService.login(user)).pipe(
            map((res: any) => {
                return { access_token: res.token, id: res.id, isLoggedIn: res.isLoggedIn }
            }));
    }

    @Post('verify')
    async verifyEmail(@Body() payload): Promise<any> {
        try {
            let res = await this.userService.verifyEmail(payload);
            if (res && res.verifyEmailStatus == VERIFY_EMAIL_STATUS.ALREADY_VERIFIED) {
                return { message: 'You have successfully verified the account', isEmailVerified: 'ALREADY_VERIFIED' };
            } else if (res && res.verifyEmailStatus == VERIFY_EMAIL_STATUS.VERIFIED) {
                return { message: 'You have successfully verified the account', isEmailVerified: 'VERIFIED' };
            }
        }
        catch (error) {
            return { message: error, isEmailVerified: false };
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile/:id')
    findOne(@Param() params): Observable<UserInterface> {
        return this.userService.findOne(params.id);
    }

    // @Get()
    // findAll(): Observable<UserInterface[]> {
    //     return this.userService.findAll();
    // }

    @UseGuards(JwtAuthGuard)
    @Get()
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('username') username: string
    ): Observable<Pagination<UserInterface>> {
        limit = limit > 100 ? 100 : limit;
        if (username === null || username === undefined) {
            return this.userService.paginate({ page: Number(page), limit: Number(limit), route: 'https://localhost:3000/api/users' });
        } else {
            return this.userService.paginationFilterByUsername(
                {
                    page: Number(page),
                    limit: Number(limit),
                    route: 'https://localhost:3000/api/users',
                }, { username }
            );
        }
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    delete(@Param('id') id: string): Observable<UserInterface> {
        return this.userService.delete(Number(id));
    }

    @UseGuards(JwtAuthGuard, UserIsUserGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() user: UserInterface): Promise<any> {
        return (await this.userService.updateUser(Number(id), user)).pipe(
            map((res: any) => {
                return { access_token: res.token, id: res.id, isLoggedIn: res.isLoggedIn, message: 'Profile updated Successfully.' }
            })
        );
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id/role')
    updateRoleOfUser(@Param('id') id: string, @Body() user: UserInterface): Observable<UserInterface> {
        return this.userService.updateRoleOfUser(Number(id), user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storage))
    async uploadFile(@UploadedFile() file, @Request() req): Promise<Observable<Object>> {
        const user: UserInterface = req.user;
        return (await this.userService.updateUser(user.id, { profileImage: file.filename })).pipe(
            map((res: any) => {
                return { access_token: res.token, id: res.id, isLoggedIn: res.isLoggedIn, message: 'Profile updated Successfully.' }
            })
        );
    }

    // @UseGuards(JwtAuthGuard)
    @Get('profile-image/:imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/profileimages/' + imagename)))
    }

}
