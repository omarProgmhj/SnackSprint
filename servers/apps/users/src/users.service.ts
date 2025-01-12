import { Injectable, BadRequestException } from '@nestjs/common';
import { register } from 'module';
import { ActivationDto, LoginDto, RegisterDto } from './dto/user.dto';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/Prisma.service';
import { ConfigService } from '@nestjs/config';
import { response, Response } from 'express';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email/email.service';
import { TokenSender } from './utils/sendToken';



interface UserData {
  name: string;
  email: string;
  password: string;
  phone_number: number ;
}
@Injectable()
export class UsersService {
  constructor(
    private readonly JwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly ConfigService: ConfigService,
    private readonly EmailService: EmailService,
  ) {}
  


  // register user 
  async register(RegisterDto: RegisterDto, response: Response) {
    const { name, email, password, phone_number } = RegisterDto;

    const isEmailExist = await this.prisma.user.findUnique({
      where: {
        email: email,
      }
    })
    if (isEmailExist) { throw new BadRequestException('User already exist with this email!'); }

    const isPhoneNumberisUnique = await this.prisma.user.findUnique({
      where: {
        phone_number: phone_number,
      },
    });
    if (isPhoneNumberisUnique) { throw new BadRequestException('phone number already exist with this phone')}

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      phone_number,
    };

    const activationToken = await this.createActivationToken(user);

    const activationCode = activationToken.activationCode;

    

    await this.EmailService.sendMail({
      email,
      subject: "Activate your account",
      template: "./activation-mail",
      name,
      activationCode,
    })


    return { activationToken , response }
  }

  // create activation token 
  async createActivationToken(user: UserData) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = this.JwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.ConfigService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '5m',
      },
    );
    return { token, activationCode };
  }

  async activateUser(activationDto: ActivationDto, response: Response) {
    const { activationToken,activationCode } = activationDto;

    const newUser: { user: UserData, activationCode: string} = this.JwtService.verify(
      activationToken,
      { secret: this.ConfigService.get<string>('ACTIVATION_SECRET')} as JwtVerifyOptions);

    if (newUser.activationCode !== activationCode) {
      throw new BadRequestException('Invalid activation code');
    }

    const existUser = await this.prisma.user.findUnique({
      where: {
        email: newUser.user.email,
      }
    });

    if (existUser) {
      throw new BadRequestException('User already exist with htis email');
    }
    const user = await this.prisma.user.create({
      data: {
        name: newUser.user.name,
        email: newUser.user.email,
        password: newUser.user.password,
        phone_number: newUser.user.phone_number,
      },
    });

    return {user, response}
  }


  // Login service
  async Login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user && (await this.comparePassword(password, user.password))) {
      const tokenSender = new TokenSender(this.ConfigService, this.JwtService);
      return tokenSender.sendToken(user);
    } else {
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: {
          message: 'Invalid email or password',
        },
      };
    }
  }

  async comparePassword(password: string, hashedPassword: string ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }


  // get logged in user 
  async getLoggedInUser(req: any) {
    console.log('Request Object:', req)
    const user = req.user;
    const accessToken = req.accesstoken 
    const refreshToken = req.refreshtoken;
    return { user, refreshToken, accessToken}
  }

  // log out user 
  async logoutUser(req: any) {
    req.user = null;
    req.refreshtoken = null;
    req.accesstoken = null;
    return { message: 'Logged out successfully!' };
  }


  // get all users service 
  async getUsers() {
    return this.prisma.user.findMany({});
  }
}