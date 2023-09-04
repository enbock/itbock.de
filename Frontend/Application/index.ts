import StartController from "Application/Start/Controller/Controller";
import DependencyInjectionContainer from "Application/DependencyInjection/Container";

const RootDependency: StartController = DependencyInjectionContainer.startControllerController;

RootDependency.start();
