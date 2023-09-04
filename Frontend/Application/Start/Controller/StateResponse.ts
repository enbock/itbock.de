import Response from "Core/Start/StartUseCase/Response";

export default class StateResponse implements Response {
    public text: string = "";
    public hasStarted: boolean = false;
}
