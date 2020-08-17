import * as core from '@actions/core'
import * as glob from '@actions/glob'
import * as exec from '@actions/exec'
import {issueCommand} from '@actions/core/lib/command'

const elmFormatCmd = core.getInput('elm_format', {
  required: true
})
const elmFiles = core.getInput('elm_files', {
  required: true
})
const shouldGlob = core.getInput('elm_glob').toUpperCase() === 'TRUE'
const workingDirectory = core.getInput('working-directory')

const globFiles = async (pattern: string): Promise<string[]> => {
  if (shouldGlob) {
    const globber = await glob.create(elmFiles)
    return globber.glob()
  } else {
    return pattern.split('\n')
  }
}

const runElmFormat = async (): Promise<Report> => {
  let output = ''
  let errput = ''

  const options = {
    cwd: workingDirectory,
    ignoreReturnCode: true,
    listeners: {
      stdout: (data: Buffer) => {
        output += data.toString()
      },
      stderr: (data: Buffer) => {
        errput += data.toString()
      }
    },
    silent: true
  }

  const files = await globFiles(elmFiles)
  if (files.length === 0) {
    throw Error('No Elm files found, please check your ELM_FILES')
  }

  await exec.exec(elmFormatCmd, [...files, '--validate'], options)

  if (errput.length > 0) {
    throw Error(errput)
  }

  return JSON.parse(output)
}

type Report = Message[]

interface Message {
  path: string
  message: string
}

const issueErrors = (report: Report): number => {
  let reported = 0
  for (const message of report) {
    issueCommand('error', {file: message.path}, message.message)
    reported++
  }
  return reported
}

const reportFailure = (reported: number): void => {
  if (reported) {
    core.setFailed(
      `elm-format reported errors with ${reported} ${
        reported === 1 ? 'file' : 'files'
      }`
    )
  }
}

async function run(): Promise<void> {
  try {
    await runElmFormat().then(issueErrors).then(reportFailure)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
