import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/user.entity';
import { Like, Repository } from 'typeorm';
import { UserInterface, UserRole } from '../models/user.interface';
import { Observable, from, of, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AuthService } from 'src/auth/services/auth.service';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { EmailVerification } from '../models/emailverification.entity';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import fs = require('fs');
import { MailerService } from '@nestjs-modules/mailer';
import { VERIFY_EMAIL_STATUS } from '../models/user.const';
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<UserInterface>,
        @InjectRepository(EmailVerification) private readonly emailVerificationRepository: Repository<EmailVerification>,
        private authService: AuthService,
        private readonly configService: ConfigService,
        private readonly mailerService: MailerService,
    ) { }

    async login(user: UserInterface) {
        const validUser = await this.userRepository.findOneBy({ email: user.email });
        if (!validUser) {
            throw new BadRequestException('User not found!');
        } else if (!validUser.email_verified) {
            throw new BadRequestException('User is not verified.');
        }

        if (validUser) {
            delete validUser.password;
            let payload = {
                ...validUser,
            }
            let isValidateUser = await this.validateUser(user.email, user.password);
            if (isValidateUser) {
                return this.authService.generateJWT(payload).pipe(map((jwt: string) => { return { token: jwt, id: validUser.id, isLoggedIn: true } }));
            } else {
                throw new BadRequestException('Invalid email or password');
            }
        }
    }

    async create(user: UserInterface): Promise<any> {
        let userExist = await this.findByMail(user.email);
        if (!userExist) {
            return this.authService.hashPassword(user.password).pipe(
                switchMap((passwordHash: string) => {
                    const newUser = new User();
                    newUser.firstName = user.firstName;
                    newUser.lastName = user.lastName;
                    // newUser.username = user.username;
                    newUser.email = user.email;
                    newUser.password = passwordHash;
                    newUser.email_verified = false;
                    newUser.role = UserRole.USER;

                    return from(this.userRepository.save(newUser)).pipe(
                        map((user: User) => {
                            const { password, ...result } = user;
                            return result;
                        }),
                        catchError(err => throwError(err))
                    )
                })
            )
        } else if (userExist && !userExist.email_verified) {
            return of(userExist);
        } else {
            throw new HttpException('User Already Registered.', HttpStatus.FORBIDDEN);
        }
    }

    async createEmailToken(email: string): Promise<boolean> {
        let emailVerification = await this.emailVerificationRepository.findOneBy({ email: email });
        if (emailVerification && ((new Date().getTime() - emailVerification.timestamp.getTime()) / 60000 < 15)) {
            throw new HttpException('Email Sent Recently, Please verify your email.', HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
            let emailVerificationModel = await this.emailVerificationRepository.save(
                {
                    email: email,
                    // emailToken: (Math.floor(Math.random() * (9000000))).toString(), // Generate 6 digits number
                    emailToken: Math.floor(100000 + Math.random() * 900000).toString(),
                    timestamp: new Date()
                }
            )
            return true;
        }
    }

    async sendEmailVerification(email: string): Promise<boolean> {
        let model = await this.emailVerificationRepository.findOneBy({ email: email });
        let user = await this.findByMail(email);

        const encryptedToken = btoa(JSON.stringify({ token: parseInt(model.emailToken), userId: user.id }));
        const pqr = JSON.parse(atob(encryptedToken));

        if (model && model.emailToken) {
            try {
                const result = await this.mailerService.sendMail({
                    from: `BlogHub <${this.configService.get('EMAIL_USER')}>`,
                    to: email,
                    subject: `BlogHub - Verify Email`,
                    template: 'verify-email',
                    context: {
                        otp: parseInt(model.emailToken),
                        firstName: user.firstName,
                        lastName: user.lastName,
                        buttonUrl: `http://localhost:4200/verify/${encryptedToken}`
                    }
                });
                return true;
            } catch (err) {
                return false;
            }
        } else {
            throw new HttpException('User Not Registered', HttpStatus.FORBIDDEN);
        }
    }

    async verifyEmail(payload): Promise<any> {
        let verifyEmailStatus;

        let emailVerified = await this.emailVerificationRepository.findOneBy({ emailToken: payload.otp });
        if (emailVerified && emailVerified.email) {
            let user = await this.userRepository.findOneBy({ email: emailVerified.email });
            if (user) {
                user.email_verified = true;
                let saveUser = await this.userRepository.save(user);
                await this.emailVerificationRepository.delete(emailVerified.id);
                verifyEmailStatus = {
                    verifyEmailStatus: VERIFY_EMAIL_STATUS.VERIFIED
                };
            }
        } else {
            let currentUser = await this.userRepository.findOneBy({ id: payload.userId });
            if (currentUser && currentUser.email_verified) {
                verifyEmailStatus = {
                    verifyEmailStatus: VERIFY_EMAIL_STATUS.ALREADY_VERIFIED
                };
            }
        }
        return verifyEmailStatus;
    }

    async validateUser(email: string, password: string) {
        let user = await this.userRepository.findOneBy({ email });
        const isMatch: boolean = bcrypt.compareSync(password, user.password);
        return isMatch;
    }

    async findByMail(email: string): Promise<UserInterface> {
        return await this.userRepository.findOneBy({ email });
    }

    findAll(): Observable<UserInterface[]> {
        return from(this.userRepository.find()).pipe(
            map((users) => {
                users.forEach(function (v) { delete v.password });
                return users
            })
        );
    }

    findOne(id: number): Observable<UserInterface> {
        return from(this.userRepository.findOne({ where: { id }, relations: ['blogEntries'] })).pipe(
            map((user: UserInterface) => {
                const { password, ...result } = user;
                return result;
            })
        )
    }

    paginate(options: IPaginationOptions): Observable<Pagination<UserInterface>> {
        return from(paginate<UserInterface>(this.userRepository, options, {
            relations: ['blogEntries']
        })).pipe(
            map((usersPagable: Pagination<UserInterface>) => {
                usersPagable.items.forEach(function (v) { delete v.password });
                return usersPagable;
            })
        )
    }

    paginationFilterByUsername(options: IPaginationOptions, user: UserInterface): Observable<Pagination<UserInterface>> {
        return from(this.userRepository.findAndCount({
            skip: Number(options.page) * Number(options.limit) || 0,
            take: Number(options.limit) || 10,
            order: { id: "ASC" },
            select: ['id', 'firstName', 'lastName', 'username', 'email', 'role', 'email_verified'],
            where: [
                { username: Like(`%${user.username}%`) }
            ]
        })).pipe(
            map(([users, totalUsers]) => {
                const usersPagable: Pagination<UserInterface> = {
                    items: users,
                    links: {
                        first: options.route + `?limit=${options.limit}`,
                        previous: options.route + ``,
                        next: options.route + `?limit=${options.limit}&page=${Number(options.page) + 1}`,
                        last: options.route + `?limit=${options.limit}&page=${totalUsers / Number(options.limit)}`
                    },
                    meta: {
                        currentPage: Number(options.page),
                        itemCount: users.length,
                        itemsPerPage: Number(options.limit),
                        totalItems: totalUsers,
                        totalPages: Math.ceil(totalUsers / Number(options.limit))
                    }
                };
                return usersPagable;
            })
        )
    }

    delete(id: number): Observable<any> {
        return from(this.userRepository.delete(id));
    }

    async updateUser(id: number, user: UserInterface): Promise<any> {
        const updateUser = await this.userRepository.findOne({ where: { id: id } });
        if (!updateUser) {
            throw new NotFoundException('User not found');
        }
        delete updateUser.password;
        Object.assign(updateUser, user);
        await this.userRepository.save(updateUser);
        return this.authService.generateJWT(updateUser).pipe(map((jwt: string) => { return { token: jwt, id: updateUser.id, isLoggedIn: true } }));
    }

    async update(id: number, user: UserInterface) {
        delete user.email;
        delete user.password;
        delete user.role;
        // return from(this.userRepository.update(id, user)).pipe(
        //     switchMap(() => this.findOne(id))
        // );

        // console.log('USER>>>>', user);
        // let updateUser = await from(this.userRepository.update(id, user));

        let updateUser = await from(this.userRepository.update(id, user)).pipe(
            switchMap(() => this.findOne(id))
        );
        // console.log('updateUser11>>>>', updateUser);


        updateUser.subscribe(async res => {
            delete res.password;
            let resp = this.authService.generateJWT(res).pipe(map((jwt: string) => {
                return { token: jwt, id: res.id, isLoggedIn: true }
            }));
            console.log('RESP>>>>', resp);
            let abc = resp.subscribe(v => {
                console.log('v>>>>', v);
                return { token: v.token, id: v.id, isLoggedIn: true }
            })
            // return resp.pipe(map((data) => {
            //     console.log('DATA>>>>', data);
            // }))
            console.log('abc>>>>', abc);
        });
        // return updateUser;

        // let new_token_res;
        // updateUser.subscribe(async e => {
        //     console.log('EEEEE>>>>>', e);
        //     const validUser = await this.userRepository.findOneBy({ email: e.email });
        //     console.log('validUser>>>>', validUser);
        //     if (validUser) {
        //         delete validUser.password;
        //         let payload = {
        //             ...validUser,
        //         }

        //         new_token_res =  await this.authService.generateJWT(validUser).pipe(map((jwt: string) => {
        //             return { token: jwt, id: validUser.id, isLoggedIn: true }
        //         }));
        //         console.log('new_token_res>>>>>', new_token_res);
        //         new_token_res.subscribe(v=> console.log(v));
        //     }
        // });
        // return new_token_res;
    }

    updateRoleOfUser(id: number, user: UserInterface): Observable<any> {
        return from(this.userRepository.update(id, user));
    }




}
