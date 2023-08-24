import {AppConst} from "../casino/AppConst";
import {MainView} from "./guiStates/pages/MainView";
import {PaytableWindow} from "./guiStates/windows/PaytableWindow";
import {GuiDesktop} from "./guiStates/gui/GuiDesktop";
import {GuiMobile} from "./guiStates/gui/GuiMobile";
import {WarningReality} from "../casino/gui/windows/WarningReality";
import {SlotStateBase} from "../casino/crashGames/SlotStateBase";
import {SettingWindow} from "../casino/crashGames/gui/windows/SettingWindow";
import {HistoryWindow} from "./guiStates/windows/HistoryWindow";
import MobileKeyW from "./guiStates/windows/MobileKeyW";

export class SlotState extends SlotStateBase {
    constructor() {
        super();
    }

    showGame() {
        if (OMY.Omy.isDesktop) {
            OMY.Omy.viewManager.addTopGui(new GuiDesktop());
        } else {
            OMY.Omy.viewManager.addTopGui(new GuiMobile());
            OMY.Omy.viewManager.regWO(new MobileKeyW(), AppConst.W_MOBILE_KEY);
        }

        /*@type {MainView} */
        this._mainView = new MainView();
        OMY.Omy.viewManager.regWO(this._mainView, AppConst.P_VIEW_MAIN);
        // if (!AppG.playingForFun)
        OMY.Omy.viewManager.regWO(new WarningReality(), AppConst.W_REALITY);
        OMY.Omy.viewManager.regWO(new SettingWindow(), AppConst.W_LOCALISATION);
        OMY.Omy.viewManager.regWO(new PaytableWindow(), AppConst.W_PAY);
        OMY.Omy.viewManager.regWO(new HistoryWindow(), AppConst.W_HISTORY);

        super.showGame();
    }

    continueNewSession() {
        return super.continueNewSession();
    }
}
