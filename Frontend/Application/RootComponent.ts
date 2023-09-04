import Component from "@enbock/ts-jsx/Component";

export class ViewModel {
}

export default interface RootComponent extends Component {
    set model(model: ViewModel);
}
