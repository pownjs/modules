const path = require('path')
const { promisify } = require('util')
const { exists, readFile } = require('fs')
const readPackageTree = require('read-package-tree')

const existsAsync = promisify(exists)
const readFileAsync = promisify(readFile)
const readPackageTreeAsync = promisify(readPackageTree)

const maxLevel = process.env.POWN_MODULES_MAX_LEVEL || Infinity

const flattenModuleTree = async(tree) => {
    function* unravel(node, level) {
        if (level > maxLevel) {
            return
        }
        else {
            level = level + 1
        }

        yield { config: node.package.pown, package: node.package, realpath: node.realpath }

        if (level <= maxLevel) {
            for (let i = 0; i < node.children.length; i++) {
                yield* unravel(node.children[i], level)
            }
        }
    }

    return Array.from(unravel(tree, 0))
}

const loadModuleConfigs = async(modules) => {
    return Promise.all(modules.map(async(module) => {
        if (!module.config) {
            const pathname = path.join(module.realpath, '.pownrc')

            const exists = await existsAsync(pathname)

            if (exists) {
                const data = await readFileAsync(pathname)

                module.config = JSON.parse(data.toString())
            }
        }

        return module
    }))
}

const defaultRoot = process.env.POWN_ROOT || path.dirname(require.main.filename)
const defaultPaths = [defaultRoot].concat((process.env.POWN_PATH || '').split(path.delimiter).map(p => p.trim()).filter(p => p))

const callbackify = (func) => {
    return (paths, callback) => {
        switch (typeof(paths)) {
            case 'undefined':
                callback = undefined
                paths = defaultPaths
                break
            case 'function':
                callback = paths
                paths = defaultPaths
                break
        }

        const promise = func(paths)

        if (callback) {
            promise
                .then((result) => callback(null, result))
                .catch((error) => callback(error, null))

            return
        }

        return promise
    }
}

exports.listNodeModules = callbackify(async(paths) => {
    const trees = []

    for (let path of paths) {
        const tree = await readPackageTreeAsync(path)
        const flatTree = await flattenModuleTree(tree)

        trees.push(flatTree)
    }

    return [].concat(...trees)
})

exports.listPownModules = callbackify(async(paths) => {
    const nodeModules = await exports.listNodeModules(paths)
    const extendedNodeModules = await loadModuleConfigs(nodeModules)
    const filteredModules = extendedNodeModules.filter((module) => module.config)

    return filteredModules
})

exports.list = exports.listPownModules
