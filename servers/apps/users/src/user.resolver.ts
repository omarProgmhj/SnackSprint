import { Args, Context, Mutation, Resolver, Query } from "@nestjs/graphql";
import { UsersService } from './users.service';
import { ActivationResponse, LoginResponse, RegisterResponse, LogoutResposne, ResetPasswordResponse, ForgotPasswordResponse } from './types/user.types';
import { ActivationDto, ForgotPasswordDto, RegisterDto, ResetPasswordDto } from "./dto/user.dto";
import { BadRequestException, UseGuards } from "@nestjs/common";
import { User } from './entities/user.entity';
import { Response } from "express";
import { AuthGards } from "./guards/auth.guards";


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

    @Query(() => LoginResponse)
    @UseGuards(AuthGards)
    async getLoggedInUser(@Context() context: { req: Request }) {
        return await this.usersService.getLoggedInUser(context.req);
    }

    @Mutation(() => ForgotPasswordResponse)
    async forgotPassword(@Args('forgotPasswordDto') forgotPasswordDto: ForgotPasswordDto ): Promise<ForgotPasswordResponse> {
        return await this.usersService.forgotPassword(forgotPasswordDto);
    }

    @Mutation(() => ResetPasswordResponse)
    async resetPassword(
        @Args('resetPasswordDto') resetPasswordDto: ResetPasswordDto
    ): Promise<ResetPasswordResponse> {
        return await this.usersService.resetPassword(resetPasswordDto);
    }

    @Query(() => LogoutResposne)
    @UseGuards(AuthGards)
    async LogOutUser(@Context() context: { req: Request }) {
        return await this.usersService.logoutUser(context.req);
    } 
    

    @Query(() => [User])
    async getUsers() {
        return this.usersService.getUsers();
    }



    
}