import { Args, Context, Mutation, Resolver, Query } from "@nestjs/graphql";
import { UsersService } from './users.service';
import { ActivationResponse, LoginResponse, RegisterResponse } from './types/user.types';
import { ActivationDto, RegisterDto } from "./dto/user.dto";
import { BadRequestException } from "@nestjs/common";
import { User } from './entities/user.entity';
import { Response } from "express";


@Resolver('User')
export class UserResolver {
    constructor(private readonly usersService: UsersService) {}

    generateActivationToken() {
        return "hello"
    }

    @Mutation(() => RegisterResponse)
    async register( @Args('registerInput') registerDto: RegisterDto, @Context() context: {res: Response} ): Promise<RegisterResponse> {
        if (!registerDto.name || !registerDto.email || !registerDto.password) {
            throw new BadRequestException('Please fill the all fields');
        }
        
        const { activationToken }  = await this.usersService.register(registerDto, context.res);

        return { activation_token : activationToken.token,  };
    }

    @Mutation(() => ActivationResponse)
    async activateUser( @Args('activationDto') activationDto: ActivationDto, @Context() context: { res: Response }): Promise<ActivationResponse> {
        return await this.usersService.activateUser(activationDto, context.res);

    }

    @Mutation(() => LoginResponse)
    async Login(
        @Args('email') email: string,
        @Args('password') password: string,
    ): Promise<LoginResponse> {
        return await this.usersService.Login({ email, password });
    }
    

    @Query(() => [User])
    async getUsers() {
        return this.usersService.getUsers();
    }



    
}