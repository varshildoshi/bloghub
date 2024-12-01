import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { BlogService } from '../service/blog.service';
import { Observable, of } from 'rxjs';
import { BlogEntry } from '../model/blog.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { UserIsAuthorGuard } from '../guards/userIsAuthor-guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
import { ImageInterface } from '../model/image.interface';

export const storage = {
    storage: diskStorage({
        destination: './uploads/blogImages',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`)
        }
    })
}

@Controller('blog-entries')
export class BlogController {

    BLOG_ENTRIES_URL = 'http://localhost:3000/blog-entries';

    constructor(
        private blogService: BlogService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() blogEntry: BlogEntry, @Request() req): Observable<BlogEntry> {
        const user = req.user;
        return this.blogService.create(user, blogEntry);
    }

    // @Get()
    // findBlogEntries(@Query('userId') userId: number): Observable<BlogEntry[]> {
    //     if (userId == null) {
    //         return this.blogService.findAllBlog();
    //     } else {
    //         return this.blogService.findByUser(userId);
    //     }
    // }

    @UseGuards(JwtAuthGuard)
    @Get('')
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        limit = limit > 100 ? 100 : limit;
        return this.blogService.paginateAll({
            limit: Number(limit),
            page: Number(page),
            route: this.BLOG_ENTRIES_URL
        })
    }

    @UseGuards(JwtAuthGuard)
    @Get('user/:user')
    indexByUser(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Param('user') userId: number
    ) {
        limit = limit > 100 ? 100 : limit;
        return this.blogService.paginateByUser({
            limit: Number(limit),
            page: Number(page),
            route: this.BLOG_ENTRIES_URL
        }, Number(userId))
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: number): Observable<BlogEntry> {
        return this.blogService.findOneBlog(id);
    }

    @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
    @Put(':id')
    updateBlog(@Param('id') id: number, @Body() blogEntry: BlogEntry): Observable<BlogEntry> {
        return this.blogService.updateBlog(Number(id), blogEntry);
    }

    @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
    @Delete(':id')
    deleteBlog(@Param('id') id: number): Observable<any> {
        return this.blogService.deleteBlog(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('image/upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file, @Request() req): Observable<ImageInterface> {
        return of(file);
    }

    // @UseGuards(JwtAuthGuard)
    @Get('image/:imagename')
    findBlogImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/blogImages/' + imagename)))
    }
}
