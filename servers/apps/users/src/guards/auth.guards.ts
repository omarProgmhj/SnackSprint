import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from "../../../../prisma/Prisma.service";
import { GqlExecutionContext } from '@nestjs/graphql';



@Injectable()
export class AuthGards implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly config: ConfigService,
    ){}

    async canActivate(context: ExecutionContext):Promise<boolean> {
        const gqlContext = GqlExecutionContext.create(context);
        const { req } = gqlContext.getContext();

        console.log('GraphQL Context:', gqlContext);
        console.log('Request Headers:', req.headers);

        const accessToken = req.headers.accesstoken ;
        const refreshToken = req.headers.refreshtoken;

        if (!accessToken || !refreshToken) {
            throw new UnauthorizedException("Please login to access to this resource!");
        }

        if (accessToken) {
            const decoded = this.jwtService.verify(accessToken, {
                secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
            });

            if(!decoded) {
                throw new UnauthorizedException("Invalid access token!");
            }
            await this.updateAccessToken(req); 
        }
        return true
    }

    private async updateAccessToken(req: any): Promise<void> {
        try {
            const refreshToken = req.headers.refreshtoken as string;
            const decoded = this.jwtService.verify(refreshToken, {
                secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
            });

            console.log('Decoded Access Token:', decoded);
            
            if (!decoded) {
                throw new UnauthorizedException("Invalid refresh token!");
            }

            const user = await this.prisma.user.findUnique({
                where: {
                    id: decoded.id,
                }
            });

            const accessToken = this.jwtService.sign(
                {
                    id: user.id,
                },
                {
                    secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
                    expiresIn: '15m',
                },
            );

            req.accessToken = accessToken;
            req.refreshToken = refreshToken;
            req.user = user;

        } catch(error) {
            throw new UnauthorizedException(error.message);
        }
    }
}