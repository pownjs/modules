const lib = require('../lib')

const assert = require('assert')

describe('lib', () => {
    describe('#list()', () => {
        it('should handle callback', (done) => {
            lib.list((err, modules) => {
                assert.equal(err, null)
                assert.equal(modules.length, 0)
                
                done()
            })
        })
        
        it('should handle promise', async () => {
            const modules = await lib.list()

            assert.equal(modules.length, 0)
        })
    })
})
