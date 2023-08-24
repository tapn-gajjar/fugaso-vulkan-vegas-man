export default class Point {
    constructor(graphic) {
        this._graphic = graphic;
        /** @type {Point} */
        this._next = null;
        /** @type {Point} */
        this._prev = null;
        /** @type {Point} */
        this._first = null;
        /** @type {Point} */
        this._last = null;
    }

    /**
     * @param {Point}point
     */
    setFirst(point) {
        this._first = point;
    }

    /**
     * @param {Point}point
     */
    setLast(point) {
        this._last = point;
    }

    destroy() {
        this._graphic = null;
        this._next = null;
        this._prev = null;
        this._first = null;
        this._last = null;
    }

    set x(value) {
        this._graphic.x = value;
    }

    get x() {
        return this._graphic.x;
    }

    /**
     * @param {Point}point
     */
    set next(value) {
        this._next = value;
    }

    /**
     * @returns {Point}
     */
    get next() {
        return this._next;
    }

    /**
     * @param {Point}point
     */
    set prev(value) {
        this._prev = value;
    }

    /**
     * @returns {Point}
     */
    get prev() {
        return this._prev;
    }

    /**
     * @returns {Point}
     */
    get first() {
        return this._first;
    }

    /**
     * @returns {Point}
     */
    get last() {
        return this._last;
    }
}