import { Module } from '@nestjs/common';
import appModules from 'src/modules';
import * as appSerivce from 'src/services';
import * as appController from 'src/controllers';
import * as libs from 'src/libs';
import * as strategies from 'src/strategies';
import { convertObjectToArray } from 'src/utils/convert-object-to-array-util';

@Module({
    imports: appModules,
    controllers: [...convertObjectToArray(appController)],
    providers: [
        ...convertObjectToArray(appSerivce),
        ...convertObjectToArray(libs),
        ...convertObjectToArray(strategies),
    ],
})
export class AppModule {}
