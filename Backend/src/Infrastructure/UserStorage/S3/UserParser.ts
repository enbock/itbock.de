import ParseHelper from '../../../ParseHelper';
import UserEntity from '../../../Core/UserEntity';

export default class UserParser {
    constructor(private parseHelper: ParseHelper) {
    }

    public parseUser(data: string): UserEntity {
        const userData: Json = JSON.parse(data);
        const user: UserEntity = new UserEntity();

        user.username = this.parseHelper.get<string>(userData, 'username', '');
        user.userId = this.parseHelper.get<string>(userData, 'userId', '');
        user.roles = this.parseHelper.get<Array<string>>(userData, 'roles', []);

        return user;
    }
}
