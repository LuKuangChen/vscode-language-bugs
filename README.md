# BUGS VSCode Support

## Features

- syntax highlighting
- snippets, including
  - [built-in scalar and vector functions](https://www.multibugs.org/documentation/latest/Functions.html), and
  - [built-in distributions](https://www.multibugs.org/documentation/latest/Distributions.html)
- format document (Right Click > Format Document)
- check model wellformedness
  - OpenBUGS' `modelCheck`. This is only performed when a file is opened or saved.
  - 

## Known issues

- Some comments might be lost in format document. This usually happens in data and init files.
- 3-dimensional (and higher dimensional) tabular data files are not supported.
