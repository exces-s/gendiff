## Вычислитель отличий (project-lvl2-s185)
Небольшая cli-утилита для поиска отличий в конфигурационных файлах (json, yaml, ini).
```
$ gendiff before.json after.json

{
    host: hexlet.io
  + timeout: 20
  - timeout: 50
  - proxy: 123.234.53.22
  + verbose: true
  - follow: false
}
```

<a href="https://codeclimate.com/github/exces-s/project-lvl2-s185/maintainability"><img src="https://api.codeclimate.com/v1/badges/bbc235992b454e4ef4bd/maintainability" /></a>
<a href="https://codeclimate.com/github/exces-s/project-lvl2-s185/test_coverage"><img src="https://api.codeclimate.com/v1/badges/bbc235992b454e4ef4bd/test_coverage" /></a>
[![Build Status](https://travis-ci.org/exces-s/gendiff.svg?branch=master)](https://travis-ci.org/exces-s/gendiff)

### Use: 
install: `sudo npm install -g gendiff-la`.

`gendiff before.json after.json` - сравнение двух json-файлов.

`gendiff before.yml after.yml` - сравнение двух yaml-файлов.

`gendiff before.ini after.ini` - сравнение двух ini-файлов.

### Flags:
`--format` - позволяет вывести дифф в плоском формате:
```
$ gendiff --format plain before.json after.json

Property 'timeout' was updated. From '50' to '20'
Property 'proxy' was removed
Property 'common.setting4' was removed
Property 'common.setting5' was removed
Property 'common.setting2' was added with value: 200
Property 'common.setting6.ops' was added with value: 'vops'
Property 'common.sites' was added with value: 'hexlet.io'
Property 'group1.baz' was updated. From 'bars' to 'bas'
Property 'group3' was removed
Property 'verbose' was added with value: true
Property 'group2' was added with complex value
```
---
`--json` - позволяет вывести дифф в виде json.
