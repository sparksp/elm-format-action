import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {issueCommand} from '@actions/core/lib/command'

const elmFormatCmd = core.getInput('elm_format', {
  required: true
})
const elmFiles = core.getInput('elm_files', {
  required: true
})

const runElmFormat = async (): Promise<Report> => {
  let output = ''
  let errput = ''

  const options = {
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

  await exec.exec(elmFormatCmd, [elmFiles, '--validate'], options)

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
