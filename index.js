const fs = require('fs')
const path = require('path')
const map = require('async/map')
const filter = require('async/filter')
const memoize = require('async/memoize')
const constant = require('async/constant')
const waterfall = require('async/waterfall')
const readPackageTree = require('read-package-tree')

const flattenModuleTree = (tree, done) => {
    function* unravel(node) {
        yield {config: node.package.pown, package: node.package, realpath: node.realpath}

        for (let i = 0; i < node.children.length; i++) {
            yield* unravel(node.children[i])
        }
    }

    map(unravel(tree), (module, done) => {
        done(null, module)
    }, done)
}

const loadModuleConfigs = (modules, done) => {
    map(modules, (module, done) => {
        if (!module.config) {
            fs.readFile(path.join(module.realpath, '.pownrc'), (err, data) => {
                if (!err) {
                    try {
                        module.config = JSON.parse(data.toString())
                    } catch (err) {
                        done(err)

                        return
                    }
                }
            })
        }

        done(null, module)
    }, done)
}

const filterPownModules = (modules, done) => {
    filter(modules, (module, done) => {
        done(null, module.config)
    }, done)
}

const defaultRoot = process.env.POWN_ROOT || path.dirname(require.main.filename)

exports.listNodeModules = memoize((root, done) => {
    if (typeof(root) === 'function') {
        done = root
        root = defaultRoot
    }

    const tasks = [
        constant(root, _ => true),
        readPackageTree,
        flattenModuleTree
    ]

    waterfall(tasks, done)
}, root => typeof(root) === 'function' ? defaultRoot : root)

exports.listPownModules = memoize((root, done) => {
    if (typeof(root) === 'function') {
        done = root
        root = defaultRoot
    }

    const tasks = [
        constant(root, _ => true),
        readPackageTree,
        flattenModuleTree,
        loadModuleConfigs,
        filterPownModules
    ]

    waterfall(tasks, done)
}, root => typeof(root) === 'function' ? defaultRoot : root)

exports.list = exports.listPownModules
