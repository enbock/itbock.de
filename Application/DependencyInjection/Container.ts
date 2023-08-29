// @formatter:off
import StartController from 'Application/Start/Controller';
import renderApplication from "Application/Start/View/Start";

class Container {
    private manualInjections: any = {
        startControllerDocument: document,
        startControllerInitializeApplication: renderApplication
    };
    private _startController?: StartController;
    public get startController(): StartController { if (this._startController)
        return this._startController;
    else
        return this._startController = new StartController(this.manualInjections.startControllerDocument, this.manualInjections.startControllerInitializeApplication); }
}
var DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;
