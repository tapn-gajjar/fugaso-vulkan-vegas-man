import Point from "./Point";

export class CoordinateLine {
    constructor(graphic) {
        /** @type {OMY.OContainer} */
        this._graphic = graphic;
        this._gdConf = this._graphic.json;
        this._dStep = this._gdConf["dx"];
        this._maxDots = this._gdConf["max"];
        this._speed = this._gdConf["speed"];
        this._editMode = Boolean(this._gdConf["edit"]);
        this._coef = 1;
        /*** @type {PIXI.utils.EventEmitter}*/
        this._emit = new OMY.OmyConst.Emit();
        /** @type {Array.<Point>} */
        this._list = [];
        this._createDots();
    }

    _createDots() {
        for (let i = 0; i < this._maxDots; i++) {
            const dot = new Point(OMY.Omy.add.spriteJson(this._graphic, this._gdConf["dot"]));
            this._emit.on("first", dot.setFirst, dot);
            this._emit.on("last", dot.setLast, dot);
            this._list.push(dot);
        }
        this._updatePos();
    }

    /**     * @private     */
    _updatePos() {
        for (let i = 0; i < this._maxDots; i++) {
            this._list[i].x = i * this._dStep;
            this._list[i].prev = (i === 0) ? null : this._list[i - 1];
            this._list[i].next = (i === (this._maxDots - 1)) ? null : this._list[i + 1];
        }
        this._emit.emit("first", this._list[0]);
        this._emit.emit("last", this._list[this._maxDots - 1]);
    }

    startMove() {
        if (this._editMode) return;
        OMY.Omy.addUpdater(this._update, this);
        this._coef = 1;
    }

    stopMove() {
        if (this._editMode) return;
        OMY.Omy.removeUpdater(this._update, this);
        this._updatePos();
    }

    /**     * @private     */
    _update() {
        /** @type {Point} */
        let dot = this._list[0].last;
        while (dot) {
            dot.x -= this._speed * this._coef;
            if (dot.x < -this._dStep) {
                dot.x = dot.last.x + this._dStep;
                dot.next.prev = dot.prev;
                if (dot.prev) dot.prev.next = dot.next;
                dot.last.next = dot;
                dot.next = null;
                let buffer = dot.prev;
                dot.prev = dot.last;
                this._emit.emit("last", dot);
                dot = buffer;
            } else {
                dot = dot.prev;
            }
        }
    }

    updateSpeed(coef) {
        this._coef = coef;
    }

    destroy() {
        this._graphic = null;
        this._gdConf = null;
        this._emit.removeAllListeners("first");
        this._emit.removeAllListeners("last");
        this._emit = null;
        for (let i = 0; i < this._list.length; i++) {
            this._list[i].destroy();
        }
        this._list.length = 0;
        this._list = null;
        OMY.Omy.removeUpdater(this._update, this);
    }
}
