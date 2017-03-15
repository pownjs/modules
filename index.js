const fs = require('fs')
const path = require('path')
const map = require('async/map')
const filter = require('async/filter')
const waterfall = require('async/waterfall')
const readPackageTree = require('read-package-tree')

const consolidate = (tree, done) => {
    function* unravel(node) {
        yield {package: node.package, realpath: node.realpath}

        for (let i = 0; i < node.children.length; i++) {
            yield* unravel(node.children[i])
        }
    }

    map(unravel(tree), (module, done) => {
        done(null, module)
    }, done)
}

exports.listNodeModules = (root, done) => {
    if (typeof(root) === 'function') {
        done = root
        root = path.dirname(require.main.filename)
    }

    const tasks = [
        readPackageTree.bind(null, root, _ => true),
        consolidate
    ]

    waterfall(tasks, done)
}

const supplement = (modules, done) => {
    map(modules, (module, done) => {
        if (module.package.pown) {
            module.pown = module.package.pown

            done(null, module)
        } else {
            fs.readFile(path.join(module.realpath, '.pownrc'), (err, data) => {
                if (err) {
                    done(null, module)
                } else {
                    try {
                        module.pown = JSON.parse(data.toString())
                    } catch (err) {
                        done(err)
                    }
                }
            })
        }
    }, done)
}

const isolate = (modules, done) => {
    filter(modules, (module, done) => {
        done(null, module.pown)
    }, done)
}

exports.listPownModules = (root, done) => {
    if (typeof(root) === 'function') {
        done = root
        root = path.dirname(require.main.filename)
    }

    const tasks = [
        this.listNodeModules.bind(this, root),
        supplement,
        isolate
    ]

    waterfall(tasks, done)
}
