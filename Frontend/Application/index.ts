import StartController from 'Application/Start/Controller';
import DependencyInjectionContainer from 'Application/DependencyInjection/Container';

const RootDependency: StartController = DependencyInjectionContainer.startController;

RootDependency.start();
