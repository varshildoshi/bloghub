import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/user.entity';
import { Like, Repository } from 'typeorm';
import { UserInterface, UserRole } from '../models/user.interface';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AuthService } from 'src/auth/services/auth.service';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<UserInterface>,
        private authService: AuthService
    ) { }

    create(user: UserInterface): Observable<UserInterface> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new User();
                newUser.name = user.name;
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.password = passwordHash;
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
            select: ['id', 'name', 'username', 'email', 'role'],
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

    update(id: number, user: UserInterface): Observable<any> {
        delete user.email;
        delete user.password;
        delete user.role;
        return from(this.userRepository.update(id, user)).pipe(
            switchMap(() => this.findOne(id))
        );
    }

    updateRoleOfUser(id: number, user: UserInterface): Observable<any> {
        return from(this.userRepository.update(id, user));
    }

    login(user: UserInterface): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: UserInterface) => {
                if (user) {
                    return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt));
                } else {
                    return 'Wrong Credentials';
                }
            })
        );
    }

    validateUser(email: string, password: string): Observable<UserInterface> {
        return from(this.userRepository.findOne({
            where: { email: email }, select: {
                id: true, name: true, username: true, email: true, password: true, role: true, profileImage: true
            }
        })).pipe(
            switchMap((user: User) => this.authService.comparePassword(password, user.password).pipe(
                map((match: boolean) => {
                    if (match) {
                        const { password, ...result } = user;
                        return result;
                    } else {
                        throw Error;
                    }
                })
            ))
        )

    }

    findByMail(email: string): Observable<UserInterface> {
        return from(this.userRepository.findOneBy({ email }));
    }
}
