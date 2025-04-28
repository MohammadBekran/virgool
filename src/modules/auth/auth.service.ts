import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { EAuthType } from './enums/type.enum';
import { EAuthMethod } from './enums/method.enum';
import { isEmail, isMobilePhone } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import {
  EAuthMessages,
  EBadRequestMessages,
  EConflictMessages,
  ENotFoundMessages,
} from 'src/common/enums/messages.enum';
import { randomInt } from 'crypto';
import { OTPEntity } from '../user/entities/otp.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OTPEntity) private otpRepository: Repository<OTPEntity>,
  ) {}

  async userExistence(authDto: AuthDto) {
    const { type, method, username } = authDto;

    switch (type) {
      case EAuthType.Login:
        return this.login(method, username);
      case EAuthType.Register:
        return this.register(method, username);
      default:
        throw new UnauthorizedException(EAuthMessages.InvalidMethod);
    }
  }
  async login(method: EAuthMethod, username: string) {
    const validatedUsername = this.validateUsername(method, username);
    const user = await this.checkUserExistence(method, validatedUsername);
    if (!user) throw new UnauthorizedException(EAuthMessages.UserNotFound);

    const otp = await this.saveOTP(user.id);

    return {
      code: otp.code,
    };
  }
  async register(method: EAuthMethod, username: string) {
    const validatedUsername = this.validateUsername(method, username);
    let user = await this.checkUserExistence(method, validatedUsername);
    if (user) throw new ConflictException(EConflictMessages.UserAlreadyExists);
    if (method === EAuthMethod.Username) {
      throw new BadRequestException(EBadRequestMessages.RegisterUsernameExists);
    }

    user = this.userRepository.create({
      [method]: username,
    });
    user = await this.userRepository.save(user);
    user.username = `m_${user.id}`;
    await this.userRepository.save(user);

    const otp = await this.saveOTP(user.id);

    return {
      code: otp.code,
    };
  }
  async saveOTP(userId: string) {
    const code = randomInt(10000, 99999).toString();
    const expiresIn = new Date(Date.now() + 1000 * 60 * 2);
    let isOtpExists = false;

    let otp = await this.otpRepository.findOneBy({
      userId,
    });
    if (otp) {
      isOtpExists = true;

      otp.code = code;
      otp.expiresIn = expiresIn;
    } else {
      otp = this.otpRepository.create({
        code,
        expiresIn,
        userId,
      });
    }

    otp = await this.otpRepository.save(otp);

    if (!isOtpExists) {
      await this.userRepository.update(
        {
          id: userId,
        },
        {
          otpId: otp.id,
        },
      );
    }

    return otp;
  }
  async checkOTP() {}
  async checkUserExistence(method: EAuthMethod, username: string) {
    let user: UserEntity | UserEntity[] | null;
    user = await this.userRepository.find();

    switch (method) {
      case EAuthMethod.Email:
        user = await this.userRepository.findOneBy({ email: username });
        break;
      case EAuthMethod.Phone:
        user = await this.userRepository.findOneBy({ phone: username });
        break;
      case EAuthMethod.Username:
        user = await this.userRepository.findOneBy({ username });
        break;
    }

    return user;
  }
  validateUsername(method: EAuthMethod, username: string) {
    switch (method) {
      case EAuthMethod.Email:
        if (isEmail(username)) return username;
        throw new BadRequestException(ENotFoundMessages.InvalidEmail);
      case EAuthMethod.Phone:
        if (isMobilePhone(username, 'fa-IR')) return username;
        throw new BadRequestException(ENotFoundMessages.InvalidPhone);
      case EAuthMethod.Username:
        if (String(username) && username.length < 50) return username;
        throw new BadRequestException(ENotFoundMessages.InvalidUsername);
    }
  }
}
