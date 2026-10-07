import KnowledgeIndex from './KnowledgeIndex';

export default interface KnowledgeStorage {
    loadIndex(): Promise<KnowledgeIndex>;

    saveIndex(index: KnowledgeIndex): Promise<void>;
}
