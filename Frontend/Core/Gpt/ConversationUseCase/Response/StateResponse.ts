import ConversationEntity from 'Core/Gpt/ConversationEntity';

export default interface StateResponse {
    isLoading: boolean;
    conversations: Array<ConversationEntity>;
}
