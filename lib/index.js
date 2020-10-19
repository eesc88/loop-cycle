"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var async = require("async");
var moment = require("moment");
/**
 * 循环控制
 */
var Loop = /** @class */ (function () {
    function Loop(options) {
        var _this = this;
        var name = options.name, INTERVAL_MINI_TIME = options.INTERVAL_MINI_TIME, INTERVAL_MAX_TIME = options.INTERVAL_MAX_TIME, loop = options.loop;
        this.name = name || 'Loop';
        this.INTERVAL_MINI_TIME = INTERVAL_MINI_TIME || 2e3; //默认循环调用时间间隔最小为2s
        this.INTERVAL_MAX_TIME = INTERVAL_MAX_TIME || 60 * 1e3; //默认循环调用最大时间间隔1m
        if (this.INTERVAL_MAX_TIME <= this.INTERVAL_MINI_TIME) {
            throw new Error('INTERVAL_MAX_TIME must be greater than INTERVAL_MINI_TIME.');
        }
        this.LOOP_RUN = true;
        this.TIME_UNIT = 1e3;
        this.deamon(loop, function (error) {
            if (error) {
                console.error('Loop error.[name=%s,error=%j]', _this.name, error);
            }
            else {
                console.error('Loop interruption.[name=%s]', _this.name);
            }
        });
    }
    /**
     * 守护启动
     * @param {*} loop
     * @param {*} cb
     */
    Loop.prototype.deamon = function (loop, cb) {
        var deamon_counter = 0;
        function deamonEvent() {
            deamon_counter++;
            if ((deamon_counter * this.TIME_UNIT) > this.INTERVAL_MAX_TIME) {
                console.warn('Loop callbark TimeOut.[name=%s]', this.name);
                if (loopCallback) {
                    deamon_counter = 0;
                    console.log('Call Loop Callbark.[name=%s]', this.name);
                    loopCallback();
                }
                else {
                    deamon_counter = 0;
                    console.warn('LoopCallbark not init.[name=%s]', this.name);
                }
            }
        }
        setInterval(deamonEvent.bind(this), 1 * this.TIME_UNIT);
        var loopCallback = null;
        this.run(function (cb) {
            loopCallback = cb;
            loop(function (error) {
                deamon_counter = 0;
                cb(error);
            });
        }, cb);
    };
    /**
     * 启动Loop
     * @param {*} loop
     * @param {*} cb
     */
    Loop.prototype.run = function (loop, cb) {
        var _this = this;
        var cycle_last_time = 0;
        var current_time = 0;
        async.whilst(function (cb) {
            current_time = moment().valueOf();
            cb(null, _this.LOOP_RUN);
        }, function (cb) {
            if ((current_time - cycle_last_time) > _this.INTERVAL_MINI_TIME) {
                cycle_last_time = moment().valueOf();
                callRun();
            }
            else {
                setTimeout(function () {
                    cycle_last_time = moment().valueOf();
                    callRun();
                }, _this.INTERVAL_MINI_TIME - (current_time - cycle_last_time));
            }
            function callRun() {
                var isCallBack = false;
                function reCb(error) {
                    if (isCallBack) {
                        console.warn('Ignore the callback. The Loop callback is complete.');
                    }
                    else {
                        isCallBack = true;
                        cb(error);
                    }
                }
                loop(reCb);
            }
        }, cb);
    };
    return Loop;
}());
module.exports = Loop;
