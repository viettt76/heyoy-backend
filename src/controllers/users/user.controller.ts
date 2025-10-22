import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserService } from 'src/services';
import { apiHelper } from 'src/utils/api-helper';

@Controller('/users')
@UseGuards(AccessTokenGuard, RolesGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/me')
    async getUsers(@Req() req: any) {
        return apiHelper({
            action: () => this.userService.getUserInfo(req.user.id),
        });
    }
}
