import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from "prisma/Prisma.service";
import { GqlExecutionContext } from '@nestjs/graphql';



@Injectable()
export class AuthGards {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly config: ConfigService,
    ){}

    async canActivate(context: ExecutionContext):Promise<boolean> {
        const gqlContext = GqlExecutionContext.create(context);
        const req = gqlContext.getContext();

        const accessToken = req.headers.accessToken as string;
        const refreshToken = req.headers.refreshToken as string;

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
            
        }
        return true
    }

    private async updateAccessToken(req: any): Promise<void> {
        try {
            const refreshToken = req.headers.refreshToken as string;
            const decoded = this.jwtService.verify(refreshToken, {
                secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
            });
            if (!decoded) {
                throw new UnauthorizedException("Invalid refresh token!");
            }

            const user = await this.prisma.user.findUnique({
                where: {
                    id: decoded.userId,
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

            req.accesstoken = accessToken;
            req.refreshtoken = refreshToken;
            req.user = user;

        } catch(error) {
            throw new UnauthorizedException(error.message);
        }
    }
}