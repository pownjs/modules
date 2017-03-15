# pown-modules  [![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/pownjs/Lobby)

> Utility library for working with Pown.js modules.

## Quickstart

From the same directory as your project's package.json, install this module with the following command:

```sh
$ npm install pown-modules --save
```

Once that's done, you can list all installed pown modules like this:

```js
const pownModules = require('pown-modules)

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

## Pown Modules

A pown module is a regular NPM module which exports pown features and options via package.json or .pownrc.

**Example: package.json**

```json
{
    pown: {
        tools: {
            mytool: './mytool.js'
        }
    }
}
```

**Example: .pownrc**

```json
{
    tools: {
        mytool: './mytool.js'
    }
}
```
