import { AuthenticatedUserDto } from './authenticated.user.dto';

export class LoginResponseDto {
  access_token: string;
  user: AuthenticatedUserDto;
}
