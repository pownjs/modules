const lib = require('../lib')

const assert = require('assert')

describe('lib', () => {
    describe('#listNodeModules()', () => {
        it('must return list of node modules', (done) => {
            lib.listNodeModules((err, modules) => {
                assert.ok(err === null)
                assert.ok(modules.length > 0)

                done()
            })
        })

        it('must return list of node modules (async/await)', async() => {
            const modules = await lib.listNodeModules()

            assert.ok(modules.length > 0)
        })
    })

    describe('#listPownModules()', () => {
        it('must return list of node modules', (done) => {
            lib.list((err, modules) => {
                assert.ok(err === null)
                assert.ok(modules.length === 0)

                done()
            })
        })

        it('must return list of node modules (async/await)', async() => {
            const modules = await lib.list()

            assert.ok(modules.length === 0)
        })
    })
})
