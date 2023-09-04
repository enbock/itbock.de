import {ShadowComponentReceiver} from "@enbock/ts-jsx/Component";

export default interface ModuleController extends ShadowComponentReceiver {
    init(): Promise<void>;
}
