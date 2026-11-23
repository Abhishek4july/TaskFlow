
import {
  Injectable,
  ConflictException,UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    // 1. Check whether the email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create the user in the database
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // 4. Return the created user
    return {
      message: 'User registered successfully',
      user,
    };
  }

  async login(loginDto: LoginDto) {
  const { email, password } = loginDto;

  // 1. Find user by email
  const user = await this.prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new UnauthorizedException('Invalid email or password');
  }

  // 2. Compare entered password with stored hash
  const isPasswordValid = await bcrypt.compare(
    password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid email or password');
  }

  const payload = {
  sub: user.id,
  email: user.email,
};

const accessToken = await this.jwtService.signAsync(payload);

return {
  message: 'Login successful',
  access_token: accessToken,
};

}

async getProfile(userId: number) {
  const user = await this.prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  return user;
}

}
