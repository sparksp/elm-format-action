[![elm-format-action status](https://github.com/sparksp/elm-format-action/workflows/build-test/badge.svg)](https://github.com/sparksp/elm-format-action/actions)

# elm-format --validate

Validate your [Elm] files using [elm-format] - any unformatted files will cause the check to fail and a note will be added to each failing file.

[Elm]: https://elm-lang.org/
[elm-format]: https://github.com/avh4/elm-format

## Finding elm-format

You must have `elm-format` available in your build, here is an example where elm-format is in `package.json`.

```yaml
jobs:
  lint:
    steps:
    - uses: actions/checkout@v2
    - run: yarn
    - name: Add elm-format to path
      run: yarn bin >> $GITHUB_PATH
    - uses: sparksp/elm-format-action@v1
      with: 
        # elm_format: elm-format
        # elm_files: src/
        # elm_glob: false
        # working-directory: ./
```

## Multiple Files

To match multiple files or directories, list each on a new line...

```yaml
    - uses: sparksp/elm-format-action@v1
      with: 
        elm_files: |
          src/Main.elm
          src/Wait.elm
          tests/
```

## File Glob

This action supports file globs using [@actions/glob].  elm-format will process each file or directory it is given, so take care to match only elm files OR directories with your globs.

```yaml
    - uses: sparksp/elm-format-action@v1
      with: 
        # Match all elm files except any TW.elm
        elm_files: |
          src/**/*.elm
          !**/TW.elm
        elm_glob: true
```

[@actions/glob]: https://github.com/actions/toolkit/tree/master/packages/glob#patterns
