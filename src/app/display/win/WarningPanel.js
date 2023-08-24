import {AppG} from "../../../casino/AppG";
import {CrashConst} from "../../../casino/crashGames/CrashConst";
import {AppConst} from "../../../casino/AppConst";

export default class WarningPanel extends PIXI.utils.EventEmitter {
    constructor(graphic) {
        super();
        /** @type {OMY.OContainer} */
        this._graphic = graphic;
        this._gdConf = this._graphic.json;
        this._editMode = this._gdConf["edit"];
        this._createGraphics();
        AppG.emit.on(CrashConst.WARNING_MESSAGE, this._updateWarning, this);
    }

    /**     * @private     */
    _createGraphics() {
        /** @type {OMY.OContainer} */
        this._warnCanvas = this._graphic.getChildByName("c_win");
        /** @type {OMY.OGraphic} */
        this._bg = this._warnCanvas.getChildByName("g_bg");
        /** @type {OMY.OTextFont} */
        this._tField = this._warnCanvas.getChildByName("t_field");
        this._warningType = "MAGNIFY_MAN_IS_BUSTED";
        this._locConst = CrashConst.LOC_CONST_WARN[this._warningType]["text"];
        this._updateGraphic();

        this._showTime = this._gdConf["show_time"];
        this._waitTime = this._gdConf["wait_time"];
        this._hideTime = this._gdConf["hide_time"];
        this._ease = this._gdConf["ease"];
        this._saveX = this._warnCanvas.x;

        if (!this._editMode) this._graphic.kill();
    }

    /**     * @private     */
    _updateWarning(warningType) {
        this._warningType = warningType;
        switch (this._warningType) {
            case AppConst.WARNING_NO_CASH_FOR_BET:
            case AppConst.WARNING_NO_CASH: {
                this._locConst = "warnings_text" + String(this._warningType);
                break;
            }

            default: {
                this._locConst = CrashConst.LOC_CONST_WARN[this._warningType]["text"];
                break;
            }
        }
        this._graphic.revive();
        this._updateGraphic();

        OMY.Omy.remove.tween(this._warnCanvas);
        this._timerWait?.destroy();
        this._warnCanvas.alpha = 0;
        this._warnCanvas.x = this._warnCanvas.width * .5;
        OMY.Omy.add.tween(this._warnCanvas,
            {x: this._saveX, alpha: 1, ease: this._ease}, this._showTime, null);
        this._timerWait = OMY.Omy.add.timer(this._waitTime, this._onCloseHandler, this);
    }

    /**     * @private     */
    _updateGraphic() {
        this._tField.text = this._getText(this._locConst);
        let width = this._tField.width + 20;
        let height = this._tField.height + 10;
        this._bg.json.width = width;
        this._bg.json.height = height;
        this._bg.drawByJson(true);
        this._bg.x = -width + 10;
        this._bg.y = -height * .5;
        AppG.updateGameSize(this._graphic);
    }

    _getText(locConst) {
        return OMY.Omy.loc.getText(locConst);
    }

    /**     * @private     */
    _onCloseHandler() {
        this._timerWait?.destroy();
        this._timerWait = null;
        OMY.Omy.remove.tween(this._warnCanvas);
        OMY.Omy.add.tween(this._warnCanvas,
            {alpha: 0}, this._hideTime, this._graphic.kill.bind(this._graphic));
    }

    destroy() {
        this._graphic = null;
        this._gdConf = null;
        AppG.emit.off(CrashConst.WARNING_MESSAGE, this._updateWarning, this);
        OMY.Omy.remove.tween(this._warnCanvas);
        this._warnCanvas = null;
        this._bg = null;
        this._tField = null;
        this._locConst = null;
        this._ease = null;
        this._timerWait?.destroy();
        this._timerWait = null;
    }
}