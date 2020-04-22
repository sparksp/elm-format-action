<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Elm Format Action for GitHub Workflows

You must have `elm-format` available in your build

```yaml
steps:
- uses: actions/checkout@v2
- run: npm install -g elm-format
- uses: sparksp/elm-format-action
  with: 
    # elm_format: elm-format
    # elm_files: src/
```
