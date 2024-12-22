import { Injectable, BadRequestException } from '@nestjs/common';
import { register } from 'module';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/Prisma.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';



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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        phone_number,
      },
    });

    const isPhoneNumberisUnique = await this.prisma.user.findUnique({
      where: {
        phone_number: phone_number,
      },
    });
    if (isPhoneNumberisUnique) { throw new BadRequestException('phone number already exist with this phone')}

    const activationToken = await this.createActivationToken(user);

    const activationCode = activationToken.activationCode;


    return { user, response }
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


  // Login service
  async Login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = {
      email,
      password,
    }
    return user;
  }

  // get all users service 
  async getUsers() {
    return this.prisma.user.findMany({});
    
  }
}