> The project has moved to monorepo. See https://github.com/pownjs/pown for more information.

[![Follow on Twitter](https://img.shields.io/twitter/follow/pownjs.svg?logo=twitter)](https://twitter.com/pownjs)
![NPM](https://img.shields.io/npm/v/@pown/modules.svg)
[![Fury](https://img.shields.io/badge/version-2x%20Fury-red.svg)](https://github.com/pownjs/lobby)
[![SecApps](https://img.shields.io/badge/credits-SecApps-black.svg)](https://secapps.com)

# Pown Modules

Modules is a utility library for working with PownJS modules. This library provides the core functionalities for the PownJS command-line framework.

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
        "transform": "./mytransform.js",
        "transforms": [
            "./mytransform2.js"
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
    "transform": "./mytransform.js",
    "transforms": [
        "./mytransform2.js"
    ]
}
```
