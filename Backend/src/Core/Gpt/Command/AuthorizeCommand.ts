import Command from './Command';
import UserStorage from '../../UserStorage';
import MfaService from '../../Mfa/MfaService';
import UserEntity from '../../UserEntity';
import GptEntity from '../GptEntity';

export default class AuthorizeCommand implements Command {
    constructor(
        private userStorage: UserStorage,
        private mfaService: MfaService
    ) {
    }

    public supports(result: GptEntity): boolean {
        return result.internalCommands.includes('authorize');
    }

    public async execute(result: GptEntity): Promise<void> {
        const username: string = String(result.data.user || '')
            .trim()
            .replace(/,/g, ' ')
            .replace(/ */g, ' ')
        ;
        const pin: string = result.data.pin || '';
        const user: UserEntity = await this.userStorage.loadUser(username);
        const isValid: boolean = await this.mfaService.validateToken(user.userId, pin);

        if (isValid) {
            result.say = 'Die Autorisierung war erfolgreich. Willkommen ' + user.username;
        } else {
            result.say = 'Die Autorisierung ist fehlgeschlagen.';
        }
    }
}
