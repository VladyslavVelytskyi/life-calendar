import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import {
    Response,
    Request,
} from 'express';
import { UserRepository } from './user.repository';
import { SignupInput } from './input/user.signupInput';
import { LoginInput } from './input/user.loginInput';
import { ErrorResponse } from './shared/errorResponse';
import { errorMessage } from './shared/errorMessage';
import { sendEmail } from '../utils/sendEmail';
import { confirmEmailLink } from '../utils/confirmEmailLink';
import { redis } from '../redis';
import { CONFIRM_EMAIL_PREFIX } from '../constants';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userReps: UserRepository,
    ) {}

    async signup(signupInput: SignupInput): Promise<ErrorResponse[] | null> {
        const userExit = await this.userReps.findOne({
            where: {
                email: signupInput.email,
            },
        });
        if (userExit) {
            return errorMessage('email', 'invalid email or password');
        }
        const user = await this.userReps.save({ ...signupInput });
        await sendEmail(signupInput.email, await confirmEmailLink(user.id));
        return null;
    }

    async confirmEmail(id: string, res: Response) {
        const userId = await redis.get(`${CONFIRM_EMAIL_PREFIX}${id}`);

        if (!userId) {
            throw new NotFoundException();
        }
        await this.userReps.update({id: userId}, {confirmed: true});

        res.send('ok');
    }

    async login(loginInput: LoginInput, req: Request): Promise<ErrorResponse[] | null> {
        const user = await this.userReps.findOne({
            where: {
                email: loginInput.email,
            },
        });
        if (!user) {
            return errorMessage('email', 'invalid email or password');
        }
        if (user.confirmed === false) {
            return errorMessage('email', 'confirm email');
        }
        const checkPassword = await bcrypt.compare(loginInput.password, user.password);
        if (!checkPassword) {
            return errorMessage('email', 'invalid email or password');
        }
        req.session.userId = user.id;
        return null;
    }
}
