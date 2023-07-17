# react-tree-svg

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

## Introduction

This project allows to create a horizontal representation of a tree.

It uses React and can be included in other project as a React component but can also be used to generate a svg.

In order to be able to generate the SVG on the server and on the client we need that each element is rendered synchronously

## Installation

`$ npm i react-tree-svg`

## Usage

### Taxonomy Tree

```js

const {render} = require('react-tree-svg');

const data = [
  {
    name: 'string',
    rank: 'string',
    count: 3,
    children: [{...}],
    nbTaxonomies: 8,
   },
];


const svg = render(data, {
        nodeRenderer: 'taxonomy',
        rankDepthOptions: {
          maxRankDepth: 8,
        },
        positionOptions: {
          spacingHorizontal: 100,
        },
      });

```

### Molecules Tree

```js
const {render} = require('react-tree-svg');

const data = [
  {
    reaction: {
      Label: 'string',
      rxnCode: 'string',
    },
    reactant: {
      molfile: 'string',
      idCode: 'string',
      mf: 'string',
      monoisotopicMass: 121.0697,
    },
    products: {
      molfile: 'string',
      idCode: 'string',
      mf: 'string',
      children: [{...}],
      monoisotopicMass: 105.065,
    },
  },
];

const svg = render(data, {
  nodeRenderer: 'molecule',
  nodeRendererOptions: {
    masses: [105.0697, 58.065, 194.1173, 163.0752, 133.0647, 135.0439],
    precision: 50,
  },
  positionOptions: {
    spacingHorizontal: 150,
  },
});

```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/react-tree-svg.svg
[npm-url]: https://www.npmjs.com/package/react-tree-svg
[ci-image]: https://github.com/cheminfo/react-tree-svg/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/cheminfo/react-tree-svg/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/react-tree-svg.svg
[codecov-url]: https://codecov.io/gh/cheminfo/react-tree-svg
[download-image]: https://img.shields.io/npm/dm/react-tree-svg.svg
[download-url]: https://www.npmjs.com/package/react-tree-svg
