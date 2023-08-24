import {GameConstStatic} from "../../GameConstStatic";
import {Background} from "../../display/Background";
import {MainViewBase} from "../../../casino/crashGames/gui/pages/MainViewBase";

export class MainView extends MainViewBase {
    constructor() {
        super();
    }

    revive() {
        this._bgGraphic = this.getChildByName("c_game_bg");

        super.revive();

        GameConstStatic.S_game_bg = GameConstStatic.S_bg;
        OMY.Omy.sound.play(GameConstStatic.S_game_bg, true);

        OMY.Omy.sound.pauseAll();
        OMY.Omy.sound.resumeAll();
    }

    _createGraphic() {
        this.bg = new Background(this._bgGraphic);
        super._createGraphic();
        /** @type {OMY.OSprite} */
        // this._bgLogoSprite = this.getChildByName("s_ui_logo_background");
    }

    _updateGameSize(dx, dy, isScreenPortrait) {
        super._updateGameSize(dx, dy, isScreenPortrait);
        // this._bgLogoSprite.width = OMY.Omy.WIDTH;
    }
}
