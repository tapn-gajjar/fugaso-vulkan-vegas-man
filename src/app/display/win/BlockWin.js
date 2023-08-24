import {AppG} from "../../../casino/AppG";

export default class BlockWin extends PIXI.utils.EventEmitter {
    constructor(graphic) {
        super();
        /** @type {OMY.OContainer} */
        this._graphic = graphic;
        this._gdConf = this._graphic.json;

        this._showTime = this._gdConf["show_time"];
        this._waitTime = this._gdConf["wait_time"];
        this._hideTime = this._gdConf["hide_time"];
        this._ease = this._gdConf["ease"];
        this._saveX = this._graphic.x;
        this._saveY = this._graphic.y;

        /** @type {OMY.OTextBitmap} */
        this._tMulti = this._graphic.getChildByName("t_multi");
        /** @type {OMY.OTextFont} */
        this._tWin = this._graphic.getChildByName("t_win");
        /** @type {OMY.OButton} */
        // this._bClose = this._graphic.getChildByName("b_close");
        // this._bClose.externalMethod(this._onCloseHandler.bind(this));
        /** @type {OMY.OTextFont} */
        this._tType = this._graphic.getChildByName("t_type");
        this._isSimple = !Boolean(this._tType);
        this._bigLimitConf = AppG.gameConst.game_const["win_limit"];
    }

    /**     * @private     */
    _onCloseHandler() {
        this._timerWait?.destroy();
        this._timerWait = null;
        if (!this._graphic.parent) return;
        OMY.Omy.remove.tween(this._graphic);
        // this._bClose.isBlock = true;
        OMY.Omy.add.tween(this._graphic, {alpha: 0}, this._hideTime, this._onHide.bind(this));
        this.emit(this.ON_HIDE, this);
    }

    animate(winValue, multiValue) {
        this._graphic.alpha = 1;
        this._graphic.x = this._graphic.width * .5;
        this._tWin.text = OMY.OMath.getCashString(winValue, true) + AppG.currency;
        this._tMulti.text = OMY.OMath.getCashString(multiValue, true) + "x";
        // this._bClose.isBlock = true;
        if (!this._isSimple) {            
            if (multiValue >= this._bigLimitConf["gui_win_super"])
                this._tType.text = "gui_win_super";
            else if (multiValue >= this._bigLimitConf["gui_win_mega"])
                this._tType.text = "gui_win_mega";
            else
                this._tType.text = "gui_win_big";
        }
        // this._graphic.y = this._saveY;
        OMY.Omy.add.tween(this._graphic, {x: this._saveX, ease: this._ease}, this._showTime, this._onShow.bind(this));
        this._timerWait = OMY.Omy.add.timer(this._waitTime, this._onCloseHandler, this);
    }

    /**     * @private     */
    _onShow() {
        // this._bClose.isBlock = false;
    }

    /**     * @private     */
    _onHide() {
        this._graphic.parent?.removeChild(this._graphic);
        OMY.Omy.remove.tween(this._graphic);
    }

    destroy() {
        this._gdConf = null;
        this._tMulti = null;
        this._tWin = null;
        // this._bClose = null;
        this._tType = null;
        this._bigLimitConf = null;
        this._timerWait?.destroy();
        this._timerWait = null;
        OMY.Omy.remove.tween(this._graphic);
        this._graphic = null;
    }

    /** @type {OMY.OContainer} */
    get graphic() {
        return this._graphic;
    }

    get type() {
        return this._isSimple;
    }

    get ON_HIDE() {
        return "on_hide";
    }
}