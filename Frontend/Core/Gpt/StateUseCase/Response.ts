import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';

export default interface Response {
    isLoading: boolean;
    conversations: Array<ConversationRecordEntity>;
}
