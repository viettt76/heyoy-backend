import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PostService } from 'src/services/posts/post.service';
import { apiHelper } from 'src/utils/api-helper';

@Controller('/posts')
@UseGuards(AccessTokenGuard, RolesGuard)
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get()
    async getPosts(@Req() req: any) {
        return apiHelper({
            action: () => this.postService.getPosts(req.user.id),
        });
    }
}
