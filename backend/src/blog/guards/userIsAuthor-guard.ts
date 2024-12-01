import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserService } from "src/user/service/user.service";
import { BlogService } from "../service/blog.service";
import { map, Observable, switchMap } from "rxjs";
import { UserInterface } from "src/user/models/user.interface";
import { BlogEntry } from "../model/blog.interface";

@Injectable()
export class UserIsAuthorGuard implements CanActivate {

    constructor(
        private userService: UserService,
        private blogService: BlogService
    ) { }

    canActivate(context: ExecutionContext): Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const params = request.params;
        const blogEntryId: number = Number(params.id);
        const user: UserInterface = request.user;

        return this.userService.findOne(user.id).pipe(
            switchMap((user: UserInterface) => this.blogService.findOneBlog(blogEntryId).pipe(
                map((blogEntry: BlogEntry) => {
                    let hasPermission = false;

                    if (user.id === blogEntry.author.id) {
                        hasPermission = true;
                    }

                    return user && hasPermission;
                })
            ))
        )
    }
}