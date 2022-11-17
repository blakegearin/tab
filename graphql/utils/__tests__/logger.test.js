/* eslint-env jest */

import { getMockAPIGatewayEvent } from '../../database/test-utils'

jest.mock('@sentry/node')

beforeEach(() => {
  jest.resetModules()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('logger', () => {
  it('contains expected methods', () => {
    const loggerMethods = ['log', 'debug', 'info', 'warn', 'error', 'fatal']
    const logger = require('../logger').default
    loggerMethods.forEach((method) => {
      expect(logger[method]).not.toBeUndefined()
    })
  })

  it('logs the error with the ID', () => {
    jest.mock('../../config', () => ({
      LOGGER: 'console',
      STAGE: 'test',
      LOG_LEVEL: 'debug',
    }))
    const { logErrorWithId } = require('../logger')
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementationOnce(() => {})
    const mockErr = new Error('Oops!')
    logErrorWithId(mockErr, 'abc-123')
    expect(consoleSpy).toHaveBeenCalled()
    const loggedErr = consoleSpy.mock.calls[0][0]
    expect(loggedErr.message).toBe('Oops!: Error ID abc-123')
  })

  test('shouldLog works as expected', () => {
    const { shouldLog } = require('../logger')
    expect(shouldLog('debug', 'info')).toBe(false)
    expect(shouldLog('info', 'debug')).toBe(true)
    expect(shouldLog('error', 'debug')).toBe(true)
    expect(shouldLog('info', 'warn')).toBe(false)
  })

  test('logger calls console method as expected', () => {
    jest.mock('../../config', () => ({
      LOGGER: 'console',
      STAGE: 'test',
      LOG_LEVEL: 'info',
    }))

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementationOnce(() => {})
    const logger = require('../logger').default
    logger.error('blah')
    expect(consoleSpy).toHaveBeenCalledWith('blah')
  })

  test('logger does not log if message is less important than the LOG_LEVEL', () => {
    jest.mock('../../config', () => ({
      LOGGER: 'console',
      STAGE: 'test',
      LOG_LEVEL: 'error',
    }))

    const consoleSpy = jest
      .spyOn(console, 'info')
      .mockImplementationOnce(() => {})
    const logger = require('../logger').default
    logger.info('blah')
    expect(consoleSpy).not.toHaveBeenCalled()
  })

  test('logger calls Sentry with an exception', () => {
    jest.mock('../../config', () => ({
      LOGGER: 'sentry',
      STAGE: 'test',
      LOG_LEVEL: 'error',
      SENTRY_PUBLIC_KEY: 'abcdef',
      SENTRY_PRIVATE_KEY: 'xyzxyz',
      SENTRY_PROJECT_ID: '123456',
    }))
    const Sentry = require('../sentry-logger').default
    const logger = require('../logger').default
    const theErr = new Error('A big problem')
    logger.error(theErr)
    expect(Sentry.captureException).toHaveBeenCalledWith(theErr)
    expect(Sentry.captureMessage).not.toHaveBeenCalled()
  })

  test('logger calls Sentry with a message', () => {
    jest.mock('../../config', () => ({
      LOGGER: 'sentry',
      STAGE: 'test',
      LOG_LEVEL: 'error',
      SENTRY_PUBLIC_KEY: 'abcdef',
      SENTRY_PRIVATE_KEY: 'xyzxyz',
      SENTRY_PROJECT_ID: '123456',
    }))
    const Sentry = require('../sentry-logger').default
    const logger = require('../logger').default
    const theMsg = 'A thing happened, FYI'
    logger.error(theMsg)
    expect(Sentry.captureMessage).toHaveBeenCalledWith(theMsg, 'error')
    expect(Sentry.captureException).not.toHaveBeenCalled()
  })

  test('logger calls Sentry with "warning" level', () => {
    jest.mock('../../config', () => ({
      LOGGER: 'sentry',
      STAGE: 'test',
      LOG_LEVEL: 'debug',
      SENTRY_PUBLIC_KEY: 'abcdef',
      SENTRY_PRIVATE_KEY: 'xyzxyz',
      SENTRY_PROJECT_ID: '123456',
    }))
    const Sentry = require('../sentry-logger').default
    const logger = require('../logger').default
    const theMsg = 'A thing happened, FYI'
    logger.warn(theMsg)
    expect(Sentry.captureMessage).toHaveBeenCalledWith(theMsg, 'warning')
  })
})

const getMockSentryScopeObj = () => ({
  addEventProcessor: jest.fn(),
  setUser: jest.fn(),
})

const getMockSentryEventObj = () => ({
  request: undefined,
})

describe('loggerContextWrapper', () => {
  test('loggerContextWrapper calls the passed function and returns its value', async () => {
    expect.assertions(2)
    jest.mock('../../config', () => ({
      LOGGER: 'console',
      STAGE: 'test',
    }))
    const { loggerContextWrapper } = require('../logger')
    const testFunc = jest.fn(() => 'hi')
    const fakeLambdaEvent = getMockAPIGatewayEvent()
    const response = await loggerContextWrapper({}, fakeLambdaEvent, testFunc)
    expect(testFunc).toHaveBeenCalled()
    expect(response).toBe('hi')
  })

  test('loggerContextWrapper sets user scope for Sentry logging', async () => {
    expect.assertions(2)
    jest.mock('../../config', () => ({
      LOGGER: 'sentry',
      STAGE: 'test',
      SENTRY_PUBLIC_KEY: 'abcdef',
      SENTRY_PRIVATE_KEY: 'xyzxyz',
      SENTRY_PROJECT_ID: '123456',
    }))
    const { loggerContextWrapper } = require('../logger')
    const Sentry = require('../sentry-logger').default
    const testFunc = jest.fn(() => 'hi')
    const userContext = {
      id: 'abc-123',
      email: 'bob@example.com',
      extraneous: 'blah',
    }
    const fakeLambdaEvent = getMockAPIGatewayEvent()
    await loggerContextWrapper(userContext, fakeLambdaEvent, testFunc)
    expect(Sentry.configureScope).toHaveBeenCalledWith(expect.any(Function))
    const configureScopeFunc = Sentry.configureScope.mock.calls[0][0]
    const mockScope = getMockSentryScopeObj()
    configureScopeFunc(mockScope)
    expect(mockScope.setUser).toHaveBeenCalledWith({
      id: 'abc-123',
      email: 'bob@example.com',
    })
  })

  test('loggerContextWrapper sets the expected request scope for Sentry logging, using data in the event', async () => {
    expect.assertions(1)
    jest.mock('../../config', () => ({
      LOGGER: 'sentry',
      STAGE: 'test',
      SENTRY_PUBLIC_KEY: 'abcdef',
      SENTRY_PRIVATE_KEY: 'xyzxyz',
      SENTRY_PROJECT_ID: '123456',
    }))
    const { loggerContextWrapper } = require('../logger')
    const Sentry = require('../sentry-logger').default
    const testFunc = jest.fn(() => 'hi')
    const userContext = {
      id: 'abc-123',
      email: 'bob@example.com',
      extraneous: 'blah',
    }
    const defaultFakeLambdaEvent = getMockAPIGatewayEvent()
    const fakeLambdaEvent = {
      ...defaultFakeLambdaEvent,
      path: '/my-fake-path/',
      httpMethod: 'POST',
      body: JSON.stringify({
        foo: 'bar',
        my: ['data', 'here'],
      }),
    }
    await loggerContextWrapper(userContext, fakeLambdaEvent, testFunc)
    const configureScopeFunc = Sentry.configureScope.mock.calls[0][0]
    const mockScope = getMockSentryScopeObj()
    configureScopeFunc(mockScope)
    const scopeAddEventFunc = mockScope.addEventProcessor.mock.calls[0][0]
    const mockSentryEvent = getMockSentryEventObj()
    const modifiedSentryEvent = scopeAddEventFunc(mockSentryEvent, {})
    expect(modifiedSentryEvent.request).toEqual({
      data: {
        foo: 'bar',
        my: ['data', 'here'],
      },
      method: 'POST',
      url: '/my-fake-path/',
    })
  })
})
