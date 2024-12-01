import { Injectable } from '@nestjs/common';
import { from, map, Observable, of, switchMap, tap } from 'rxjs';
import { BlogEntry } from '../model/blog.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntryEntity } from '../model/blog-entry.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/service/user.service';
import { UserInterface } from 'src/user/models/user.interface';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
const slugify = require('slugify');

@Injectable()
export class BlogService {

    constructor(
        @InjectRepository(BlogEntryEntity) private readonly blogRepository: Repository<BlogEntryEntity>,
        private userService: UserService
    ) { }

    create(user: UserInterface, blogEntry: BlogEntry): Observable<BlogEntry> {
        blogEntry.author = user;
        return this.generateSlug(blogEntry.title).pipe(
            switchMap((slug: string) => {
                blogEntry.slug = slug;
                return from(this.blogRepository.save(blogEntry));
            })
        )
    }

    findAllBlog(): Observable<BlogEntry[]> {
        return from(this.blogRepository.find({ relations: ['author'] }));
    }

    paginateAll(options: IPaginationOptions): Observable<Pagination<BlogEntry>> {
        return from(paginate<BlogEntry>(this.blogRepository, options, {
            relations: ['author']
        })).pipe(
            map((blogEntries: Pagination<BlogEntry>) => blogEntries)
        );
    }

    paginateByUser(options: IPaginationOptions, userId: number): Observable<Pagination<BlogEntry>> {
        return from(paginate<BlogEntry>(this.blogRepository, options, {
            relations: ['author'],
            where: [
                { author: { id: userId } }
            ]
        })).pipe(
            map((blogEntries: Pagination<BlogEntry>) => blogEntries)
        );
    }

    findOneBlog(id: number): Observable<BlogEntry> {
        return from(this.blogRepository.findOne({ where: { id }, relations: ['author'] }));
    }

    findByUser(userId: number): Observable<BlogEntry[]> {
        return from(this.blogRepository.find({
            where: {
                author: { id: userId }
            },
            relations: ['author']
        })).pipe(
            map((blogEntries: BlogEntry[]) => blogEntries)
        )
    }

    updateBlog(id: number, blogEntry: BlogEntry): Observable<BlogEntry> {
        return from(this.blogRepository.update(id, blogEntry)).pipe(
            switchMap(() => this.findOneBlog(id))
        )
    }

    deleteBlog(id: number): Observable<any> {
        return from(this.blogRepository.delete(id));
    }

    generateSlug(title: string): Observable<string> {
        return of(slugify(title))
    }
}
