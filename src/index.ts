import { dirname, resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import { traverse, parseSync, transformFromAstSync } from '@babel/core'

let ID = 0
function createAsset(fullPath) {
  const content = readFileSync(fullPath, { encoding: 'utf-8' })
  const ast = parseSync(content, {
    sourceType: 'module'
  })
  const dependencies = []
  traverse(ast, {
    ImportDeclaration({ node }) {
      node.source.value = getPath(fullPath, node.source.value)
      dependencies.push(node.source.value)
    }
  })
  const { code } = transformFromAstSync(ast, null, {
    presets: ['@babel/preset-env']
  })
  return {
    id: ID++,
    code,
    fullPath,
    dependencies,
    mappings: {}
  }
}

function createGraph(entry) {
  const cache = new Map<string, boolean>()
  const mainAsset = createAsset(entry)
  const queue = []
  updateMap(mainAsset, entry)
  for (let asset of queue) {
    asset.dependencies.forEach(relativePath => {
      let fullPath = getPath(asset.fullPath, relativePath)
      if (cache.has(fullPath)) {
        return
      }
      const childAsset = createAsset(fullPath)
      updateMap(childAsset, fullPath, asset)
    })
  }
  function updateMap(asset, fullPath, parentAsset?) {
    cache.set(fullPath, true)
    if (parentAsset) {
      parentAsset.mappings[asset.fullPath] = asset.id
    }
    queue.push(asset)
  }
  return {
    queue
  }
}

function bundle(manifest) {
  let modules = ''
  manifest.forEach(asset => {
    modules += `
    ${asset.id}:{
      fn:function ( module, exports,require) {
        ${asset.code}
      },
      mappings:${JSON.stringify(asset.mappings)},
    },
    `
  });
  return `(function (modules) {
    function readModule(id) {
      const {fn,mappings} = modules[id]
      const _module = {}
      const _exports = (_module.exports = {})
      function localrRequire(fullPath) {
        return readModule(mappings[fullPath])
      }
      fn(_module, _module.exports, localrRequire)
      return _module.exports
    }
    readModule(0)
  })({${modules}})`
}

function output(result) {
  writeFileSync(resolve('./src/output.js'), result)
}

function getPath(parentPath, relativePath) {
  return resolve(dirname(parentPath), relativePath)
}

const { queue } = createGraph('./example/entry.js')
const result = bundle(queue)
output(result)
