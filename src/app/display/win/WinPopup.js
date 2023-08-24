import {GameConstStatic} from "../../GameConstStatic";
import {AppG} from "../../../casino/AppG";
import {CrashConst} from "../../../casino/crashGames/CrashConst";

export default class WinPopup extends PIXI.utils.EventEmitter {
    constructor(graphic) {
        super();
        /** @type {OMY.OContainer} */
        this._graphic = graphic;
        this._gdConf = this._graphic.json;
        this._editMode = Boolean(this._gdConf["edit"]);
        this._editTweenMode = Boolean(this._gdConf["edit_tween"]);
        /** @type {Array.<Object>} */
        this._blockList = [];
        this._bigConf = AppG.gameConst.game_const["win_limit"];
        if (this._editMode) OMY.Omy.add.containerJson(this._graphic, this._gdConf["popup"]);
        this._editTweenMode && OMY.Omy.add.timer(this._gdConf["delay"] + 2, this._testTween, this,
            0, true, true);
        !this._editMode && AppG.emit.on(CrashConst.EMIT_ON_CASHOUT, this._updateWin, this);
        OMY.Omy.game.addGameActive(this._onGameActive, this, false);
    }

    /**     * @private     */
    _onGameActive(type) {
        while (this._blockList.length > 3) {
            this._blockList.shift();
        }
    }

    /**     * @private     */
    _testTween() {
        this._blockList.push({
            bet: 100,
            currencyCode: "EUR",
            gain: 5000,
            imageId: 0,
            multiplierAuto: 50,
            userId: 2333054,
            username: "QA-Test-EUR-004"
        });
        this._createGraphics();
    }

    /**     * @private     */
    _createGraphics() {
        if (!this._blockList.length || this._popup) return;
        this._data = this._blockList.shift();
        if (Math.abs(Number(AppG.gameRoundId) - this._data.roundId) >= 2) {
            this._createGraphics();
            return;
        }
        this._currencyOn = this._data.currencyCode;
        OMY.Omy.sound.play(GameConstStatic.S_btn_cash_out_big);

        /** @type {OMY.OContainer} */
        this._popup = OMY.Omy.add.containerJson(this._graphic, this._gdConf["popup"]);
        /** @type {OMY.OTextFont} */
        let txt = this._popup.getChildByName("t_type");
        if (this._data.multiplierAuto >= this._bigConf["gui_win_super"])
            txt.text = "gui_win_super";
        else if (this._data.multiplierAuto >= this._bigConf["gui_win_mega"])
            txt.text = "gui_win_mega";
        else if (this._data.multiplierAuto >= this._bigConf["gui_win_big"])
            txt.text = "gui_win_big";
        this._popup.getChildByName("t_user").text = this._data.username;
        this._popup.getChildByName("t_multi").text =
            OMY.OMath.getCashString(this._data.multiplierAuto, true) + "x";
        this._popup.getChildByName("t_win").text =
            OMY.OMath.getCashString(AppG.serverWork.convertValue(this._data.gain, this._currencyOn), true)
            + AppG.currency;
        this._popup.getChildByName("t_bet").text =
            OMY.OMath.getCashString(AppG.serverWork.convertValue(this._data.bet, this._currencyOn), true)
            + AppG.currency;
        if (this._data.timeBet) {
            /** @type {Date} */
            let date = new Date(this._data.timeBet);
            this._popup.getChildByName("t_date").text = date.toLocaleString("en-GB");
        } else {
            this._popup.getChildByName("t_date").text = this._data.dateOn;
        }

        this._data = null;
        AppG.updateGameSize(this._popup);
        this._animate();
    }

    /**     * @private     */
    _animate() {
        const startY = -this._popup.height - this._graphic.y - 5;
        this._popup.y = startY;
        OMY.Omy.add.tween(this._popup, {y: 0}, this._gdConf["tween_move"], null,
            {
                ease: this._gdConf["ease_start"]
            });
        OMY.Omy.add.tween(this._popup, {y: startY}, this._gdConf["tween_hide"], this._onHide.bind(this),
            {
                delay: this._gdConf["delay"],
                ease: this._gdConf["ease_end"],
                // onStart:Function
            });
    }

    /**     * @private     */
    _onHide() {
        this._popup.destroy();
        this._popup = null;
        this._createGraphics();
    }

    /**     * @private     */
    _updateWin(winData) {
        if (winData.multiplierAuto >= this._bigConf["gui_win_big"]) {
            this._blockList.push(winData);
            this._createGraphics();
        }
    }

    destroy() {
        this._gdConf = null;
        this._popup && OMY.Omy.remove.tween(this._popup);
        this._popup = null;
        this._blockList.length = 0;
        this._blockList = null;
        this._bigConf = null;
        AppG.emit.off(CrashConst.EMIT_ON_CASHOUT, this._updateWin, this);
        OMY.Omy.game.removeGameActive(this._onGameActive, this);
        this._data = null;
        this._graphic = null;
    }
}