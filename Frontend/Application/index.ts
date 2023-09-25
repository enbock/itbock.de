import StartController from 'Application/Start/Controller/Controller';
import DependencyInjectionContainer from 'Application/DependencyInjection/Container';

console.log(`
  ____             _      _           _                     _             _           
 |  _ \\           | |    | |         | |                   | |           (_)          
 | |_) | ___   ___| | __ | |     __ _| |__   ___  _ __ __ _| |_ ___  _ __ _  ___  ___ 
 |  _ < / _ \\ / __| |/ / | |    / _\` | '_ \\ / _ \\| '__/ _\` | __/ _ \\| '__| |/ _ \\/ __|
 | |_) | (_) | (__|   <  | |___| (_| | |_) | (_) | | | (_| | || (_) | |  | |  __/\\__ \\
 |____/ \\___/ \\___|_|\\_\\ |______\\__,_|_.__/ \\___/|_|  \\__,_|\\__\\___/|_|  |_|\\___||___/


`);


const RootDependency: StartController = DependencyInjectionContainer.startControllerController;

RootDependency.start();
