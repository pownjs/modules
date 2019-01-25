[![Follow on Twitter](https://img.shields.io/twitter/follow/pownjs.svg?logo=twitter)](https://twitter.com/pownjs)
![NPM](https://img.shields.io/npm/v/@pown/modules.svg)

# Pown Modules

Utility library for working with Pown.js modules.

## Quickstart

Install this module from the root of your project:

```sh
$ npm install @pown/modules --save
```

Once done, list all installed pown modules like this:

```js
const pownModules = require('@pown/modules')

pownModules.list((err, modules) => {
    if (err) {
        console.error(err)

        return
    }

    modules.forEach((module) => {
        // do something with module.config, module.package or module.realpath
    })
})
```

You can also use promises with async/await like this:

```js
const pownModules = require('@pown/modules')

const modules = await pownModules.list()

modules.forEach((module) => {
    // do something with module.config, module.package or module.realpath
})
```

## Pown Modules

A pown module is a regular NPM module which exports pown features and options via package.json or .pownrc.

**Example: package.json**

```json
{
    "pown": {
        "main": "./main.js",
        "command": "./mytool.js",
        "commands": [
            "./mytool2.js"
        ],
        "plugin": "./myplugin.js",
        "plugins": [
            "./myplugin2.js"
        ]
    }
}
```

**Example: .pownrc**

```json
{
    "main": "./main.js",
    "command": "./mytool.js",
    "commands": [
        "./mytool2.js"
    ],
    "plugin": "./myplugin.js",
    "plugins": [
        "./myplugin2.js"
    ]
}
```
