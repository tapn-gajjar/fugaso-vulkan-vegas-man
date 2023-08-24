import {BackgroundBase} from "../../casino/display/BackgroundBase";
import {AppG} from "../../casino/AppG";

export class Background extends BackgroundBase {
    constructor(graphic) {
        super(graphic);

        /** @type {OMY.OActorSpine} */
        // this._spine = this._graphic.getChildByName("a_bg_spine");
    }

    _updateGameSize(dx, dy, isScreenPortrait) {
        AppG.updateGameSize(this._graphic);
        // super._updateGameSize(dx, dy, isScreenPortrait);
        /*if (this._view !== AppG.isScreenPortrait) {
            this._view = AppG.isScreenPortrait;
            const m = AppG.isScreenPortrait ? "v" : "h";
            this._spine.play(true, this._spine.json[m]);
        }*/
        this._graphic.width = OMY.Omy.WIDTH;
        this._graphic.height = OMY.Omy.HEIGHT;
    }
}
