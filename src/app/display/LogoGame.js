import {LogoGameBase} from "../../casino/display/LogoGameBase";
import {AppG} from "../../casino/AppG";
import {AppConst} from "../../casino/AppConst";

export class LogoGame extends LogoGameBase {
    constructor(graphic) {
        super(graphic);
        this._defVScale = this._gdConf["v_scale"];
        this._defScale = this._gdConf["scale"];
        AppG.sizeEmmit.on(AppConst.EMIT_RESIZE, this._updateGameSize, this);
        this._updateGameSize(AppG.dx, AppG.dy, AppG.isScreenPortrait);
    }

    destroy() {
        this._graphic = null;
        this._gdConf = null;
    }

    _updateGameSize(dx, dy, port) {
        if (OMY.Omy.isDesktop) return;
        /*let w, h;
        w = window.game.renderer.screen.width;
        h = window.game.renderer.screen.height;

        let resWidth, resHeight;
        if (AppG.isScreenPortrait) {
            resWidth = GameConstStatic.MOB_WIDTH_V;
            resHeight = GameConstStatic.MOB_HEIGHT_V;
        } else {
            resWidth = GameConstStatic.MOB_WIDTH;
            resHeight = GameConstStatic.MOB_HEIGHT;
        }

        let scale = Math.min(w / resWidth, h / resHeight);
        scale = (scale === 1) ? 0 : scale / 2.4;*/
        const max_scale_value = 2.5;
        const some_def_coef = 0.004;
        let scale = dy * some_def_coef + ((port) ? this._defVScale : this._defScale);
        scale = (scale > max_scale_value) ? max_scale_value : scale;
        this._gdConf[((port) ? "v_" : "") + "scale"] = scale;
        this._graphic.scale.set(scale);
    }

}