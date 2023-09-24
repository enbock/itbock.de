import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';

export default class OldHomepage {
    public support(conversations: Array<ConversationRecordEntity>): boolean {
        const lastUser: ConversationRecordEntity | undefined = conversations.findLast(x => x.role == 'user');
        return lastUser !== undefined && lastUser.text.toLocaleLowerCase().indexOf('homepage') > -1;
    }

    public run(conversations: Array<ConversationRecordEntity>, result: ConversationRecordEntity): void {
        result.text = 'Link zur alten Homepage wird angezeigt.';
        result.role = 'assistant';
        result.command = 'openOldPage';
    }
}
