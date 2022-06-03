const wordMap1 = require('./wordMap_1.json')
const wordMap2 = require('./wordMap_2.json')
const wordMap3 = require('./wordMap_3.json')
const wordMap4 = require('./wordMap_4.json')
const wordMap5 = require('./wordMap_5.json')
const wordMap6 = require('./wordMap_6.json')
const wordMap7 = require('./wordMap_7.json')
const wordMap8 = require('./wordMap_8.json')
const wordMap9 = require('./wordMap_9.json')

// @TODO - Eventually we want this to simply be a package that we
// install and import as any other package.

// ORDER MATTERS
// We want easier words to overwrite hard words, so when we combine
// the objects together, add in the easier wordMaps after the harder ones
// so that harder values are overwritten in the case of a clash.
const fullWordMap = {
  ...wordMap9,
  ...wordMap8,
  ...wordMap7,
  ...wordMap6,
  ...wordMap5,
  ...wordMap4,
  ...wordMap3,
  ...wordMap2,
  ...wordMap1
}

module.exports = {
  WordMap: fullWordMap
}
