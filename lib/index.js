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

const callbackify = (func) => {
    return (root, callback) => {
        switch (typeof(root)) {
            case 'undefined':
                callback = undefined
                root = defaultRoot
                break
            case 'function':
                callback = root
                root = defaultRoot
                break
        }

        const promise = func(root)

        if (callback) {
            promise
                .then((result) => callback(null, result))
                .catch((error) => callback(error, null))

            return
        }

        return promise
    }
}

const defaultRoot = process.env.POWN_ROOT || path.dirname(require.main.filename)

exports.listNodeModules = callbackify(async(root) => {
    const tree = await readPackageTreeAsync(root)
    const flatTree = await flattenModuleTree(tree)

    return flatTree
})

exports.listPownModules = callbackify(async(root) => {
    const tree = await readPackageTreeAsync(root)
    const flatTree = await flattenModuleTree(tree)

    const modules = await loadModuleConfigs(flatTree)
    const filteredModules = modules.filter(module => module.config)

    return filteredModules
})

exports.list = exports.listPownModules
