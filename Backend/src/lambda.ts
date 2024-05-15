import DependencyInjectionContainer from './Application/Container';

export const generateTokenHandler = DependencyInjectionContainer.handler.generateTokenHandler.bind(DependencyInjectionContainer.handler);
export const validateTokenHandler = DependencyInjectionContainer.handler.validateTokenHandler.bind(DependencyInjectionContainer.handler);
