import { ConfigModule } from '@nestjs/config';
import configurations from 'src/configs/configurations';

const appModules = [
    ConfigModule.forRoot({
        isGlobal: true,
        load: [configurations],
    }),
];

export default appModules;
