import * as async from 'async'
import * as moment from 'moment'
/**
 * 循环控制
 */
class Loop {
    name: String
    INTERVAL_MINI_TIME: Number | any
    INTERVAL_MAX_TIME: Number
    LOOP_RUN: Boolean
    TIME_UNIT: Number | any
    constructor(options) {
        const { name, INTERVAL_MINI_TIME, INTERVAL_MAX_TIME, loop } = options
        this.name = name || 'Loop'
        this.INTERVAL_MINI_TIME = INTERVAL_MINI_TIME || 2e3//默认循环调用时间间隔最小为2s
        this.INTERVAL_MAX_TIME = INTERVAL_MAX_TIME || 60 * 1e3//默认循环调用最大时间间隔1m
        if (this.INTERVAL_MAX_TIME <= this.INTERVAL_MINI_TIME) {
            throw new Error('INTERVAL_MAX_TIME must be greater than INTERVAL_MINI_TIME.')
        }
        this.LOOP_RUN = true
        this.TIME_UNIT = 1e3
        this.deamon(loop, (error) => {
            if (error) {
                console.error('Loop error.[name=%s,error=%j]', this.name, error)
            } else {
                console.error('Loop interruption.[name=%s]', this.name)
            }
        })
    }
    /**
     * 守护启动
     * @param {*} loop 
     * @param {*} cb 
     */
    deamon(loop, cb) {
        let deamon_counter = 0
        function deamonEvent() {
            deamon_counter++
            if ((deamon_counter * this.TIME_UNIT) > this.INTERVAL_MAX_TIME) {
                console.warn('Loop callbark TimeOut.[name=%s]', this.name)
                if (loopCallback) {
                    deamon_counter = 0
                    console.log('Call Loop Callbark.[name=%s]', this.name)
                    loopCallback()
                } else {
                    deamon_counter = 0
                    console.warn('LoopCallbark not init.[name=%s]', this.name)
                }
            }
        }
        setInterval(deamonEvent.bind(this), 1 * this.TIME_UNIT)
        let loopCallback = null
        this.run((cb) => {
            loopCallback = cb
            loop((error) => {
                deamon_counter = 0
                cb(error)
            })
        }, cb)
    }
    /**
     * 启动Loop
     * @param {*} loop 
     * @param {*} cb 
     */
    run(loop, cb) {
        let cycle_last_time = 0
        let current_time = 0
        async.whilst((cb) => {
            current_time = moment().valueOf()
            cb(null, this.LOOP_RUN)
        }, (cb) => {
            if ((current_time - cycle_last_time) > this.INTERVAL_MINI_TIME) {
                cycle_last_time = moment().valueOf()
                callRun()
            } else {
                setTimeout(() => {
                    cycle_last_time = moment().valueOf()
                    callRun()
                }, this.INTERVAL_MINI_TIME - (current_time - cycle_last_time))
            }
            function callRun() {
                let isCallBack = false;
                function reCb(error) {
                    if (isCallBack) {
                        console.warn('Ignore the callback. The Loop callback is complete.')
                    } else {
                        isCallBack = true
                        cb(error)
                    }
                }
                loop(reCb)
            }
        }, cb)
    }
}
module.exports = Loop