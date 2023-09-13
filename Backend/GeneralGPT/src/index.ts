import Container from './DependencyInjection/Container';
import Program from './Application/Program';

const RootDependency: Program = Container.applicationProgram;

exports.handler = RootDependency.main.bind(RootDependency);
