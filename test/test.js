const chai = require('chai');
const { expect, assert } = chai;
const loop = require('../lib')

describe('start', () => {

    it('start run.', (done) => {

        let last_time = Date.now()
        const INTERVAL_MINI_TIME = 3e3
        let is_first = true
        new loop({
            name: 'dispatcher',
            INTERVAL_MINI_TIME,
            INTERVAL_MAX_TIME: 2 * 60e3,
            loop: (cb) => {
                const interval = (Date.now() - last_time) / 1000
                console.log("^linenum loop:[time=%s,interval=%s]", Date.now(), interval)
                last_time = Date.now()

                if (is_first) {
                    is_first = false
                    expect(interval).to.be.within(0, 10)
                } else {
                    expect(interval * 1000).to.be.within(INTERVAL_MINI_TIME - 100, INTERVAL_MINI_TIME + 100)
                    done()
                }
                cb()
            }
        })

    })
})