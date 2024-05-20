import DependencyInjectionContainer from './DependencyInjection/Container';

export const generateTokenHandler = DependencyInjectionContainer.handler.generateTokenHandler.bind(DependencyInjectionContainer.handler);
export const validateTokenHandler = DependencyInjectionContainer.handler.validateTokenHandler.bind(DependencyInjectionContainer.handler);
export const gptHandler = DependencyInjectionContainer.handler.generalGptHandler.bind(DependencyInjectionContainer.handler);
export const audioTransformHandler = DependencyInjectionContainer.handler.audioTransformHandler.bind(DependencyInjectionContainer.handler);
