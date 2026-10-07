import InvalidSessionIdError from './InvalidSessionIdError';

export default class SessionId {
    private static readonly uuidV4Pattern: RegExp =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    public static normalize(value: string): string {
        const normalizedValue: string = value.trim().toLowerCase();

        if (!SessionId.uuidV4Pattern.test(normalizedValue)) {
            throw new InvalidSessionIdError();
        }

        return normalizedValue;
    }
}
