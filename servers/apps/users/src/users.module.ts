import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GraphQLModule, Context } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/Prisma.service';
import { UserResolver } from "./user.resolver";
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      context: ({ req }) => ({ req }), // to make sure that the request object is availablein the GraphQL context
    }),
    EmailModule
  ],
  controllers: [UsersController],
  providers: [UsersService, ConfigService, JwtService, PrismaService, UserResolver],
})
export class UsersModule {}
