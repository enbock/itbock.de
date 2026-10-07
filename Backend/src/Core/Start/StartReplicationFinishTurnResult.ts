import Modules from './Modules';
import StartReplicationDocumentEntity from './StartReplicationDocumentEntity';

export default interface StartReplicationFinishTurnResult {
    assistantText: string;
    language: string;
    module: Modules;
    documents: Array<StartReplicationDocumentEntity>;
    resetSession?: boolean;
}
