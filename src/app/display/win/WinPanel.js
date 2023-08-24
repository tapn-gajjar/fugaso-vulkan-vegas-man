import {AppG} from "../../../casino/AppG";
import BlockWin from "./BlockWin";
import {AppConst} from "../../../casino/AppConst";
import {GameConstStatic} from "../../GameConstStatic";

export default class WinPanel extends PIXI.utils.EventEmitter {
    constructor(graphic) {
        super();
        /** @type {OMY.OContainer} */
        this._graphic = graphic;
        this._gdConf = this._graphic.json;
        this._editMode = this._gdConf["edit"];
        /** @type {Array.<BlockWin>} */
        this._blockList = [];
        /** @type {Array.<BlockWin>} */
        this._blockBigList = [];
        this._bigLimitConf = AppG.gameConst.game_const["win_limit"];
        this._createGraphics();
        AppG.emit.on(AppConst.APP_EMIT_ON_WIN, this._updateWin, this);
    }

    /**     * @private     */
    _createGraphics() {
        this._blockJson = this._gdConf["simple"];
        this._bigJson = this._gdConf["big"];
        // this._stepDy = block.height + this._gdConf["dy_step"];
        if (this._editMode && this._gdConf["edit_name"].length)
            OMY.Omy.add.containerJson(this._graphic, this._gdConf[this._gdConf["edit_name"]]);
        else
            for (let i = 0; i < AppG.gameConst.countUserBetData; i++) {
                this._createNewBlock(i);
            }
    }

    /**     * @private     */
    _createNewBlock(index, simple = true) {
        const block = OMY.Omy.add.containerJson(null, (simple) ? this._blockJson : this._bigJson);
        block.name += String(index);
        if (simple)
            this._blockList.push(new BlockWin(block));
        else
            this._blockBigList.push(new BlockWin(block));
    }

    /**     * @private     */
    _updateWin(totalWin, multiValue, winValue) {
        if (winValue) {
            let bigWin = multiValue >= this._bigLimitConf["gui_win_big"];
            if (bigWin)
                OMY.Omy.sound.play(GameConstStatic.S_btn_cash_out_big);
            else
                OMY.Omy.sound.play(GameConstStatic.S_btn_cash_out);
            OMY.Omy.sound.play(GameConstStatic.S_btn_cash_out_2);
            /** @type {BlockWin} */
            let block = null;
            /** @type {OMY.OContainer} */
            let lastChild = (this._graphic.numChildren) ?
                this._graphic.children[this._graphic.numChildren - 1] : null;
                let lastY;
            if (bigWin) {   

                if(lastChild?.json["win_name"] == "big"){
                    lastY = (lastChild) ? lastChild.y - lastChild.height : 0;
                }else{
                    lastY = (lastChild) ? lastChild.y - lastChild.height - 40 : 0;
                }
                
                if (!this._blockBigList.length)
                    this._createNewBlock(this._graphic.numChildren , false);
                block = this._blockBigList.shift();
            } else {
                lastY = (lastChild) ? lastChild.y - lastChild.height: 40;
                if (!this._blockList.length)
                    this._createNewBlock(this._graphic.numChildren);
                block = this._blockList.shift();
            }
            block.graphic.y = lastY - this._gdConf["dy_step"];
            this._graphic.addChild(block.graphic);
            block.animate(winValue, multiValue);
            block.once(block.ON_HIDE, this._onBlockHide, this);
        }
    }

    /**
     * @param {BlockWin}block
     * @private
     */
    _onBlockHide(block) {
        (block.type) ? this._blockList.push(block) : this._blockBigList.push(block);
        let downNext = false;
        let prevChild = null;
        for (let i = 0; i < this._graphic.numChildren; i++) {
            if (block.graphic === this._graphic.children[i]) {
                prevChild = block.graphic;
                downNext = true;
                continue;
            }
            if (downNext) {
                let _saveY = prevChild.y;
                if((prevChild?.json["win_name"] == "simple") && (this._graphic.children[i]?.json["win_name"] == "big")){
                    _saveY -= 40;
                }
                OMY.Omy.add.tween(this._graphic.children[i], {y: _saveY}, 0.3);
                prevChild = this._graphic.children[i];
            }
        }
    }

    destroy() {
        this._gdConf = null;
        for (let i = 0; i < this._blockList.length; i++) {
            this._blockList[i].off(this._blockList[i].ON_HIDE, this._onBlockHide, this);
            this._blockList[i].destroy();
        }
        this._blockList.length = 0;
        this._blockList = null;
        for (let i = 0; i < this._blockBigList.length; i++) {
            this._blockBigList[i].off(this._blockBigList[i].ON_HIDE, this._onBlockHide, this);
            this._blockBigList[i].destroy();
        }
        this._blockBigList.length = 0;
        this._blockBigList = null;
        AppG.emit.off(AppConst.APP_EMIT_ON_WIN, this._updateWin, this);
        this._blockJson = null;
        this._bigJson = null;
        this._bigLimitConf = null;
        for (let i = 0; i < this._graphic.numChildren; i++) {
            OMY.Omy.remove.tween(this._graphic.children[i]);
        }
        this._graphic = null;
    }
}