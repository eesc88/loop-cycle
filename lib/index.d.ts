/**
 * 循环控制
 */
declare class Loop {
    name: String;
    INTERVAL_MINI_TIME: Number | any;
    INTERVAL_MAX_TIME: Number;
    TIME_UNIT: Number | any;
    logger: any;
    free: Boolean;
    delay_timer: any;
    deamon_timer: any;
    constructor(options: any);
    /**
     * 守护启动
     * @param {*} loop
     * @param {*} cb
     */
    deamon(loop: any, cb: any): void;
    /**
     * 启动Loop
     * @param {*} loop
     * @param {*} cb
     */
    run(loop: any, cb: any): void;
    /**
     * Close the loop.
     */
    stop(): Boolean;
}
export = Loop;
