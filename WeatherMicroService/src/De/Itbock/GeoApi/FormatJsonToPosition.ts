import Position from './Position';

export default class FormatJsonToPosition {
    format(json: any) {
        const model: Position = new Position();
        model.latitude = Math.round((parseFloat(json.latitude) || 0) * 100.0) / 100.0;
        model.longitude = Math.round((parseFloat(json.longitude) || 0) * 100.0) / 100.0;

        return model;
    }
}
