import Container from './DependencyInjection/Container';


exports.handler = Container.applicationProgram.main.bind(Container.applicationProgram);
