import {AppG} from "../../../casino/AppG";
import {AppConst} from "../../../casino/AppConst";
import {BtnHome} from "../../../casino/display/buttons/BtnHome";
import {GuiBase} from "../../../casino/crashGames/gui/GuiBase";
import {BtnSetting} from "../../../casino/crashGames/display/buttons/BtnSetting";
import {BtnPayTable} from "../../../casino/crashGames/display/buttons/BtnPayTable";
import {BtnBetTable} from "../../../casino/crashGames/display/buttons/BtnBetTable";
import {BtnHistoryTable} from "../../../casino/crashGames/display/buttons/BtnHistoryTable";

export class GuiMobile extends GuiBase {
    constructor() {
        super();
    }

    _updateGameSize() {
        super._updateGameSize();
        this.getChildByName("s_bar").width = OMY.Omy.WIDTH;
    }

    _createGraphic() {
        this.json = this._gdConf = OMY.Omy.assets.getJSON("GDGui");
        OMY.Omy.add.createEntities(this, this._gdConf);

        this.getChildByName("s_bar").width = OMY.Omy.WIDTH;

        this._createTexts();
        this._createButtons();

        super._createGraphic();
        this._updateGameSize();
    }

    /**     * @public     */
    _createTexts() {
        super._createTexts();

        this.updateWin(AppG.serverWork.totalWinInRound);
        this.updateBalance();
        this.updateBet();
    }

    /**     * @public     */
    _createButtons() {
        super._createButtons();

        new BtnHistoryTable(this.getChildByName("b_history_table"));
        new BtnBetTable(this.getChildByName("b_bet_table"));
        new BtnSetting(this.getChildByName("b_setting"));
        new BtnPayTable(this.getChildByName("b_pay"));
        new BtnHome(this.getChildByName("b_home"));
    }

    /** @private */
    _onCreateWindow(wName) {
        switch (wName) {
            case AppConst.W_PAY: {
                break;
            }
        }
    }

    /** @private */
    _onRemoveWindow(wName) {
        switch (wName) {
            case AppConst.W_PAY: {
                break;
            }
        }
    }
}
