import UserEntity from '../../../Core/UserEntity';

export default class UserEncoder {
    public encodeUser(user: UserEntity): string {
        return JSON.stringify({
            username: user.username,
            userId: user.userId,
            roles: user.roles
        });
    }
}
