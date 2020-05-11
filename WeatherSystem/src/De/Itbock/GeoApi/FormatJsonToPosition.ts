import Position from "./Position";

export default class FormatJsonToPosition {
    format(json:any) {
        const model:Position = new Position();
        model.latitude = parseFloat(json.latitude);
        model.longitude = parseFloat(json.longitude);

        return model;
    }
}
