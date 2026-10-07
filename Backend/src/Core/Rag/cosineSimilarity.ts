export default function cosineSimilarity(
    left: Array<number>,
    right: Array<number>
): number {
    if (left.length === 0 || left.length !== right.length) {
        return 0;
    }

    let dotProduct: number = 0;
    let leftMagnitude: number = 0;
    let rightMagnitude: number = 0;

    for (let index: number = 0; index < left.length; index++) {
        const leftValue: number = left[index];
        const rightValue: number = right[index];

        dotProduct += leftValue * rightValue;
        leftMagnitude += leftValue * leftValue;
        rightMagnitude += rightValue * rightValue;
    }

    if (leftMagnitude === 0 || rightMagnitude === 0) {
        return 0;
    }

    return dotProduct / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}
