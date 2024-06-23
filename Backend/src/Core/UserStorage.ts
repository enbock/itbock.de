import UserEntity from './UserEntity';

export default interface UserStorage {
    loadUser(username: string): Promise<UserEntity>;

    saveUser(user: UserEntity): Promise<void>;

    deleteUser(username: string): Promise<void>;
}
