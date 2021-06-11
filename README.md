# BUGS VSCode Support

## Features

- syntax highlighting
- snippets, including
  - [built-in scalar and vector functions](https://www.multibugs.org/documentation/latest/Functions.html), and
  - [built-in distributions](https://www.multibugs.org/documentation/latest/Distributions.html)
- format document (Right Click > Format Document)
- check model wellformedness
  - OpenBUGS' `modelCheck`: this is only performed when a file is saved because it is slow on Windows.
  - My own grammar checker: this is usually faster and is performed on every file change.

## Known issues

- This extension is not enabled automatically when the name of your txt file ends does not contain the word "model". To enable the extension manually, you can click the "Plain Text" button at the bottom-right of VSCode and select "BUGS (bugs)".
- Some comments might be lost in format document. This usually happens in data and init files.
- 3-dimensional (and higher dimensional) tabular data files are not supported.
