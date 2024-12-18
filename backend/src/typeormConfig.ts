import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    username: 'postgres',
    password: 'root',
    port: 5432,
    host: 'localhost',
    database: 'bloghub',
    synchronize: true,
    entities: ["dist/**/*.entity{.ts,.js}"],
    autoLoadEntities: true
};