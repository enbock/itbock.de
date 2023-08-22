// @formatter:off
import StartController from 'Application/Start/Controller';
class Container {
    private manualInjections = new class {
        public startControllerDocument:Document = document;
    };
    private _startController?: StartController;
    public get startController(): StartController { if (this._startController)
        return this._startController;
    else
        return this._startController = new StartController(this.manualInjections.startControllerDocument); }
}
var DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;
