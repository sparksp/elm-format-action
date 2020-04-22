import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'

test('test runs', () => {
  process.env['INPUT_ELM_FORMAT'] = 'elm-format'
  process.env['INPUT_ELM_FILES'] = '__tests__/elm/Good.elm'
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecSyncOptions = {
    env: process.env
  }

  const stdout = cp.execSync(`node ${ip}`, options)
  expect(stdout.toString()).toBe('')
})

test('test reports errors', () => {
  process.env['INPUT_ELM_FORMAT'] = 'elm-format'
  process.env['INPUT_ELM_FILES'] = '__tests__/elm/Bad.elm'
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecSyncOptions = {
    env: process.env
  }

  let stdout, status
  try {
    stdout = cp.execSync(`node ${ip}`, options)
  } catch (e) {
    status = e.status
    stdout = e.stdout
  }
  expect(status).toBe(1)
  expect(stdout.toString()).toBe(
    '::error file=__tests__/elm/Bad.elm::File is not formatted with elm-format-0.8.3 --elm-version=0.19\n' +
      '::error::elm-format reported errors with 1 file\n'
  )
})
