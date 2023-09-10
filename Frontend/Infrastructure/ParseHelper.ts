/**
 * Trans-coded from https://github.com/lodash/lodash
 * @license MIT
 */

export default class ParseHelper {
    private isDeepProperty: RegExp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
    private isPlainProperty: RegExp = /^\w*$/;
    private propertyDelimiter: string = '.';
    private escapeChar: RegExp = /\\(\\)?/g;
    private property: RegExp = RegExp(
        '[^.[\\]]+' + '|' +
        '\\[(?:' +
        '([^"\'][^[]*)' + '|' +
        '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
        ')\\]' + '|' +
        '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))',
        'g'
    );

    public get<T>(object: object | null | undefined, path: string, defaultValue: T): T {
        const result: T | undefined = (object === null || object === undefined)
            ? undefined
            : this.getFromObject(object, path)
        ;
        return result === undefined ? defaultValue : result;
    }

    private getFromObject<T>(object: object, path: string): T | undefined {
        const castedPath: string[] = this.castPath(path, object);
        let current: any = object;

        for (let index: number = 0; index < castedPath.length && current !== undefined; index++) {
            current = current[castedPath[index]];
        }

        return current as T;
    }

    private castPath(value: string, object: object): string[] {
        return this.isKey(value, object) ? [value] : this.stringToPath(value);
    }

    private isKey(value: string, object: object): boolean {
        return this.isPlainProperty.test(value)
            || !this.isDeepProperty.test(value)
            || value in Object(object)
            ;
    }

    private stringToPath(string: string) {
        const result: string[] = [];
        if (string[0] === this.propertyDelimiter) {
            result.push('');
        }
        string.replace(
            this.property,
            (match: string, ...args: any[]): string => {
                const expression: string = args[0];
                const quote: string = args[1];
                const subString: string = args[2];
                let key: string = match;
                if (quote) {
                    key = subString.replace(this.escapeChar, '$1');
                } else if (expression) {
                    key = expression.trim();
                }
                result.push(key);

                return '';
            }
        );
        return result;
    }
}
