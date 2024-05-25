// noinspection JSUnusedGlobalSymbols
import Container from './DependencyInjection/Container';

export const generateTokenHandler = Container.generateTokenController.handle.bind(Container.generateTokenController);
export const validateTokenHandler = Container.validateTokenController.handle.bind(Container.validateTokenController);
export const gptHandler = Container.gptController.main.bind(Container.gptController);
export const audioTransformHandler = Container.audioTransformController.handle.bind(Container.audioTransformController);
export const i18nHandler = Container.i18nController.handle.bind(Container.i18nController);
