import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'

test('runs quietly on success', () => {
  process.env['INPUT_ELM_FORMAT'] = 'elm-format'
  process.env['INPUT_ELM_FILES'] = '__tests__/elm/Good.elm'
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecSyncOptions = {
    env: process.env
  }

  let status
  try {
    cp.execSync(`node ${ip}`, options)
  } catch (e) {
    status = e.status
  }
  expect(status).toBeUndefined() // Success!
})

test('reports errors', () => {
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
    '::error file=__tests__/elm/Bad.elm::File is not formatted with elm-format-0.8.5 --elm-version=0.19\n' +
      '::error::elm-format reported errors with 1 file\n'
  )
})

test('handles bad file input', () => {
  process.env['INPUT_ELM_FORMAT'] = 'elm-format'
  process.env['INPUT_ELM_FILES'] = '__tests__/elm/Missing.elm'
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecSyncOptions = {
    env: process.env
  }

  let status, stdout
  try {
    stdout = cp.execSync(`node ${ip}`, options)
  } catch (e) {
    status = e.status
    stdout = e.stdout
  }
  expect(status).toBe(1) // Something went wrong
  expect(stdout.toString()).toContain('::error::')
})

test('runs globs', () => {
  process.env['INPUT_ELM_FORMAT'] = 'elm-format'
  process.env['INPUT_ELM_FILES'] = '__tests__/**/*.elm\n!**/Bad.elm'
  process.env['INPUT_ELM_GLOB'] = 'true'
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecSyncOptions = {
    env: process.env
  }

  let status
  try {
    cp.execSync(`node ${ip}`, options)
  } catch (e) {
    status = e.status
  }
  expect(status).toBeUndefined() // Success!
})

test('handles no files input', () => {
  process.env['INPUT_ELM_FORMAT'] = 'elm-format'
  process.env['INPUT_ELM_FILES'] = 'Missing.elm'
  process.env['INPUT_ELM_GLOB'] = 'true'
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecSyncOptions = {
    env: process.env
  }

  let status, stdout
  try {
    stdout = cp.execSync(`node ${ip}`, options)
  } catch (e) {
    status = e.status
    stdout = e.stdout
  }
  expect(status).toBe(1) // Something went wrong
  expect(stdout.toString()).toContain('::error::No Elm files found')
})
