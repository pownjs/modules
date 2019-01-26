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
    
    describe('#hasNodeModule', () => {
        it('must find http', () => {
            assert.ok(lib.hasNodeModule('http') === true, 'http found')
        })
        
        it('must not find abc123', () => {
            assert.ok(lib.hasNodeModule('abc123') !== true, 'abc123 not found')
        })
    })
})
