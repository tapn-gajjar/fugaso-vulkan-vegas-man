import BetBlock from "./BetBlock";
import {BetPanelBase} from "../../../casino/crashGames/display/bet/BetPanelBase";

export default class BetPanel extends BetPanelBase {
    constructor(graphic) {
        super(graphic);
    }

    _createGraphic() {
        /** @type {OMY.OContainer} */
        this._canvasBet1Add = this._graphic.getChildByName("c_bet_1_add");
        /** @type {BetBlock} */
        this._bet1Add = new BetBlock(this._graphic.getChildByName("c_bet_1_add"));
        this._canvasBet1Add.kill();
        super._createGraphic();
    }

    _togglePanel(btn, one) {
        super._togglePanel(btn, one);
        if (one) {
            this._canvasBet1.revive();
            this._canvasBet1Add.kill();
        } else {
            this._canvasBet1Add.revive();
            this._canvasBet1.kill();
        }
    }

    destroy() {
        this._canvasBet1Add = null;
        this._bet1Add.destroy();
        this._bet1Add = null;

        super.destroy();
    }
}
