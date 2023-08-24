import {CoordinateLine} from "./CoordinateLine";
import {GameConstStatic} from "../../GameConstStatic";
import {AppG} from "../../../casino/AppG";
import {GameBase} from "../../../casino/crashGames/display/GameBase";

export default class GamePlay extends GameBase {
    constructor(graphic) {
        super(graphic);
    }

    _createGraphic() {
        super._createGraphic();
        this._jsonSpine = this._gdConf["fly"];
        this._jsonBgImageSpine = this._gdConf["bg_image"];
        this._jsonBgSpine = this._gdConf["bg"];
        this._jsonCloudsSpine = this._gdConf["clouds"];
        this._jsonStarsSpine = this._gdConf["stars"];
        this._jsonPowerSpine = this._gdConf["power"];
        this._jsonX100Spine = this._gdConf["x100"];
        this._showPower = false;
        this._x100Power = false;
        this._configClouds = AppG.gameConst.game_const["clouds_spine"];
        this._bufferConfigClouds = null;
        this._configStars = AppG.gameConst.game_const["stars_spine"];
        this._speedLimit = AppG.gameConst.game_const["multi_speed_limit"];
        this._x100Limit = AppG.gameConst.game_const["x100_speed_limit"];
        this._cloudMultLimit = AppG.gameConst.game_const["cloud_limit"];
        this._cloudSpeedCoef = AppG.gameConst.game_const["cloud_speed_coef"];
        this._cloudSpeed = 1;
        this._cloudSpeedTime = AppG.gameConst.game_const["cloud_time_speed"];
        this._cloudTimePercent = AppG.gameConst.game_const["cloud_time_percent"];

        this._cloudList = {};
        this._isPlayCloud = false;

        /** @type {OMY.OContainer} */
        this._flyCanvas = this._graphic.getChildByName("c_fly");
        /** @type {OMY.OActorSpine} */
        this._aSpine = null;
        /** @type {OMY.OActorSpine} */
        this._aBgIdle = null;
        /** @type {OMY.OActorSpine} */
        this._aPowerSpine = null;
        /** @type {OMY.OActorSpine} */
        this._aX100Spine = null;

        this._speedPercent = 1;

        OMY.Omy.add.spriteJson(this._flyCanvas, this._jsonBgImageSpine);

        /** @type {CoordinateLine} */
        this._vertCoordinate = new CoordinateLine(this._graphic.getChildByName("c_dots_vert"));
        /** @type {CoordinateLine} */
        this._horCoordinate = new CoordinateLine(this._graphic.getChildByName("c_dots_hor"));
    }

    _beforeStart() {
        this._txtMulti.tint = this._txtMulti.json["fall"];
        super._beforeStart();

        if (!this._aBgIdle)
            this._aBgIdle = OMY.Omy.add.actorJson(this._flyCanvas, this._jsonBgSpine);
        this._aBgIdle.gotoAndPlay(0, true, this._aBgIdle.json["idle"]);
        this._aBgIdle.stop();
    }

    _waitForBet() {
        super._waitForBet();
        this._isPlayCloud = false;
        this._clearClouds();
        this._aSpine?.destroy();
        this._aBgIdle?.destroy();
        this._aBgIdle = OMY.Omy.add.actorJson(this._flyCanvas, this._jsonBgSpine);
        this._aBgIdle.gotoAndPlay(0, true, this._aBgIdle.json["start"]);

        this._aSpine = OMY.Omy.add.actorJson(this._flyCanvas, this._jsonSpine);
        this._aSpine.gotoAndPlay(0, false, this._aSpine.json["start"]);
        this._aSpine.addComplete(this._onManRunEnd, this, true);
        OMY.Omy.sound.play(GameConstStatic.S_run, true);
    }

    _prepareForPlay() {
        super._prepareForPlay();
        this._x100Power = false;
        this._showPower = false;
        this._txtMulti.tint = this._txtMulti.json["fill"];
        if (!this._aSpine) {
            if (!this._aBgIdle)
                this._aBgIdle = OMY.Omy.add.actorJson(this._flyCanvas, this._jsonBgSpine);
            this._aSpine = OMY.Omy.add.actorJson(this._flyCanvas, this._jsonSpine);
            this._aSpine.gotoAndPlay(0, true, this._aSpine.json["idle"]);
            this._aBgIdle.gotoAndPlay(0, true, this._aBgIdle.json["idle"]);
            this._showPower = true;
            if (this._multi >= this._cloudMultLimit) {
                this._randomStars();
                this._isPlayCloud = false;
            } else {
                this._randomClouds();
            }
        } else {
            
            // this._aSpine.gotoAndPlay(0, false, this._aSpine.json["multi"]);
            // this._aSpine.addComplete(this._onStartFlyIdle, this, true);
            // this._aBgIdle.gotoAndPlay(0, false, this._aBgIdle.json["custom_a_name"]);
            // this._aBgIdle.addComplete(this._onLoopBg, this, true);



            this._aSpine.removeComplete(this._onManRunEnd, this);
            this._aSpine.gotoAndPlay(0, false, this._aSpine.json["multi"]);

            this._aBgIdle.playMixAnimation(1, this._aBgIdle.json["custom_a_name"], 0, false);
            this._aBgIdle.addComplete(this._onLoopBg, this, true);
            
            // this._aSpine.removeSpineEvent(this._onStartLoop, this);
            this._aSpine.removeComplete(this._onStartFlyIdle, this);
            
            // this._aSpine.addSpineEvent(this._onStartLoop, this, true);
            this._aSpine.addComplete(this._onStartFlyIdle, this, true);

            if (!OMY.Omy.game.gamePaused) OMY.Omy.sound.play(GameConstStatic.S_jump);
        }
        if (!OMY.Omy.game.gamePaused) OMY.Omy.sound.play(GameConstStatic.S_fly_start);
        OMY.Omy.sound.play(GameConstStatic.S_fly, true);
        OMY.Omy.sound.stop(GameConstStatic.S_run);
        this._vertCoordinate.startMove();
        this._horCoordinate.startMove();
    }

    /**     * @private     */
    _onManRunEnd() {
        this._aSpine.gotoAndPlay(0, true, this._aSpine.json["start_loop"]);
    }

    /**     * @private     */
    _onLoopBg() {
        this._aBgIdle.stopMixAnimation(1);
        this._aBgIdle.gotoAndPlay(0, true, this._aBgIdle.json["idle"]);
    }

    /**     * @private     */
    // _onStartLoop(spine, event) {       
    //     if (event.data.name === "JumUp END") {
    //         this._aSpine.gotoAndPlay(0, true, this._aSpine.json["idle"]);
    //         this._randomClouds();
    //         this._showPower = true;
    //      }
    // }

      _onStartFlyIdle() {

        this._isPlayCloud = false;
        this._clearClouds();

        this._aSpine.setMixByName(this._aSpine.json["multi"], this._aSpine.json["idle"], 0.1);
        this._aSpine.gotoAndPlay(0, true, this._aSpine.json["idle"]);
        this._randomClouds();
        this._showPower = true;
    }


    _onRoundEnd() {
        super._onRoundEnd();        

        if (!OMY.Omy.game.gamePaused) OMY.Omy.sound.play(GameConstStatic.S_fly_end);
        OMY.Omy.sound.stop(GameConstStatic.S_fly);
        // this._aSpine.removeSpineEvent(this._onStartLoop, this);
        this._aSpine.removeComplete(this._onStartFlyIdle, this);

        this._aSpine.gotoAndPlay(0, false, this._aSpine.json["end"]);
        this._aBgIdle.stop();
        this._timerClouds?.destroy();
        this._stopClouds();        
        this._timerStars?.destroy();
        this._showPower = false;
        this._aPowerSpine?.destroy();
        this._aPowerSpine = null;
        this._aX100Spine?.destroy();
        this._aX100Spine = null;
        this._txtMulti.tint = this._txtMulti.json["fall"];
        this._vertCoordinate.stopMove();
        this._horCoordinate.stopMove();
    }

    // region clouds:
    //-------------------------------------------------------------------------
    /**     * @private     */
    _randomClouds() {
        if (this._isPlayCloud) return;
        this._cloudSpeed = 1;
        this._bufferConfigClouds = this._configClouds.concat();
        this._playCloudSpine();
    }

    /**     * @private     */
    _startTimerClouds() {
        let time = OMY.OMath.randomNumberFromArray(this._bufferConfigClouds);
        this._timerClouds?.destroy();
        /** @type {OMY.OTicker} */
        this._timerClouds = OMY.Omy.add.timer(time, this._playCloudSpine, this);
    }

    /**     * @private     */
    _playCloudSpine() {
        if (!this._isPlayCloud) this._isPlayCloud = true;
        /** @type {OMY.OActorSpine} */
        let cloudSpine = OMY.Omy.add.actorJson(this._flyCanvas, this._jsonCloudsSpine);
        cloudSpine.addComplete(this._onEndPlayCloud, this, true);
        cloudSpine.removeOnEnd = true;
        this._cloudList[cloudSpine.name] = cloudSpine;
        this._startTimerClouds();
    }

    /**
     * @param {OMY.OActorSpine}spine
     * @private
     */
    _onEndPlayCloud(spine) {
        if (this._cloudList[spine.name]) {
            this._cloudList[spine.name] = null;
            delete this._cloudList[spine.name];
        }
    }

    /**     * @private     */
    _cloudSpeedUpdate() {
        if (!this._isPlayCloud) return;
        if (this._multi >= this._cloudMultLimit) {
            this._randomStars();
            this._timerClouds?.destroy();
            this._timerClouds = null;
            this._isPlayCloud = false;
            return;
        }
        this._cloudSpeed += this._cloudSpeedCoef;
        if (this._bufferConfigClouds[0] > this._configClouds[0] * this._cloudTimePercent)
            this._bufferConfigClouds[0] -= this._cloudSpeedTime;
        if (this._bufferConfigClouds[1] > this._configClouds[1] * this._cloudTimePercent)
            this._bufferConfigClouds[1] -= this._cloudSpeedTime;
        /** @type {OMY.OActorSpine} */
        let cloud = null;
        for (let argumentsKey in this._cloudList) {
            cloud = this._cloudList[argumentsKey];
            if (cloud?.active)
                cloud.speed = this._speedPercent * this._cloudSpeed;
        }
    }

    /**     * @private     */
    _stopClouds() {
        if (this._isPlayCloud) {
            this._timerClouds?.destroy();
            this._timerClouds = null;
            this._isPlayCloud = false;
            /** @type {OMY.OActorSpine} */
            let cloud = null;
            for (let argumentsKey in this._cloudList) {
                cloud = this._cloudList[argumentsKey];
                if (cloud?.active)
                    cloud.stop();
            }
        }
    }

    /**     * @private     */
    _clearClouds() {
        /** @type {OMY.OActorSpine} */
        let cloud = null;
        for (let argumentsKey in this._cloudList) {
            cloud = this._cloudList[argumentsKey];
            if (cloud?.active) {
                cloud.stop();
                cloud.destroy();
            }
            this._cloudList[argumentsKey] = null;
            delete this._cloudList[argumentsKey];
        }
    }

    //-------------------------------------------------------------------------
    //endregion

    /**     * @private     */
    _randomStars() {
        this._timerStars = OMY.Omy.add.timer(OMY.OMath.randomNumberFromArray(this._configStars),
            () => {
                /** @type {OMY.OActorSpine} */
                this._starSpine = OMY.Omy.add.actorJson(this._flyCanvas, this._jsonStarsSpine);
                this._starSpine.removeOnEnd = true;
                this._randomStars();
            }, this);
    }

    _updateMulti(multi) {
        super._updateMulti(multi);
        if (this._showPower && multi > this._speedLimit) {
            this._showPower = false;
            this._powerUp();
        }
        this._x100Up(multi);
        this.getSpeedByMulti(multi);
        if (this._speedPercent > 1) this._speedUp();
    }

    /**     * @private     */
    _powerUp() {
        this._aPowerSpine?.destroy();
        /** @type {OMY.OActorSpine} */
        this._aPowerSpine = OMY.Omy.add.actorJson(this._flyCanvas, this._jsonPowerSpine);
    }

    /**     * @private     */
    _x100Up(multi) {
        if (this._x100Power) return;
        if (multi > this._x100Limit) this._x100Power = true;
        else return;
        this._aX100Spine?.destroy();
        /** @type {OMY.OActorSpine} */
        this._aX100Spine = OMY.Omy.add.actorJson(this._flyCanvas, this._jsonX100Spine);
    }

    getSpeedByMulti(multi, config) {
        config = config || {min: 1.0, max: 5.0, total: 100.0};
        let percent = OMY.OMath.toPercent(multi, config.total);
        percent = ((percent > 100) ? 100 : percent);
        this._speedPercent = ((percent * (config.max - config.min) / 100) + config.min);
        // console.info(this._speedPercent);
    }

    /**     * @private     */
    _speedUp() {
        if (this._aBgIdle?.active)
            this._aBgIdle.speed = this._speedPercent;
        this._cloudSpeedUpdate();
        if (this._starSpine?.active)
            this._starSpine.speed = this._speedPercent;
        this._vertCoordinate.updateSpeed(this._speedPercent);
        this._horCoordinate.updateSpeed(this._speedPercent);
    }

    destroy() {
        this._jsonSpine = null;
        this._jsonBgSpine = null;
        this._jsonCloudsSpine = null;
        this._jsonStarsSpine = null;
        this._jsonPowerSpine = null;
        this._jsonX100Spine = null;
        this._configClouds = null;
        this._bufferConfigClouds = null;
        this._configStars = null;
        this._cloudList = null;
        this._flyCanvas = null;
        this._aSpine = null;
        this._aBgIdle = null;
        this._aPowerSpine = null;
        this._aX100Spine = null;
        this._vertCoordinate.destroy();
        this._vertCoordinate = null;
        this._horCoordinate.destroy();
        this._horCoordinate = null;
        this._timerClouds?.destroy();
        this._timerClouds = null;

        this._timerStars?.destroy();
        this._timerStars = null;
        this._starSpine = null;

        super.destroy();
    }
}
