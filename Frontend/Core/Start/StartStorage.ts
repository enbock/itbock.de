import Modules from 'Core/Start/Modules';

export default interface StartStorage {
    getModuleName(): Modules;

    setModuleName(module: Modules): void;

    getLanguage(): string;

    setLanguage(language: string): void;
}
