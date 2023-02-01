# molecules-graph

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

## Introduction

This project allows to create a horizontal representation of a tree.

It uses React and can be included in other project as a React component but can also be used to generate a svg.

In order to be able to generate the SVG on the server and on the client we need that each element is rendered synchronously

```js
const {render} = require('svg-boxes-tree');




const data = {
  name: "Test",
  children: [{
    name: "Child 1",
    children: [{
      name: "Subchild 1"
    }]
  }]
}

render(data, {
  box: (node) => {
    node.value
  }
  arrow: (targetNode) => {

  }
})
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/svg-boxes-tree.svg
[npm-url]: https://www.npmjs.com/package/svg-boxes-tree
[ci-image]: https://github.com/cheminfo/svg-boxes-tree/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/cheminfo/svg-boxes-tree/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/svg-boxes-tree.svg
[codecov-url]: https://codecov.io/gh/cheminfo/svg-boxes-tree
[download-image]: https://img.shields.io/npm/dm/svg-boxes-tree.svg
[download-url]: https://www.npmjs.com/package/svg-boxes-tree

```

```
