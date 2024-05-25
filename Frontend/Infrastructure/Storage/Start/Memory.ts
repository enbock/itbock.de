import StartStorage from 'Core/Start/StartStorage';
import Modules from 'Core/Start/Modules';

export default class Memory implements StartStorage {
    private moduleName: Modules = Modules.START_SCREEN;
    private language: string = '';

    public getModuleName(): Modules {
        return this.moduleName;
    }

    public setModuleName(module: Modules): void {
        this.moduleName = module;
    }

    public getLanguage(): string {
        return this.language;
    }

    public setLanguage(language: string): void {
        this.language = language;
    }
}
