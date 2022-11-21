import { graphql } from 'graphql'
import { Schema } from './data/schema'
import {
  createGraphQLContext,
  getUserClaimsFromLambdaEvent,
} from './utils/authorization-helpers'
import { handleError } from './utils/error-logging'
import { loggerContextWrapper } from './utils/logger'

// Note: we need to use Bluebird until at least Node 8. Using
// native promises breaks Sentry/Raven context:
// https://github.com/getsentry/raven-node/issues/265
global.Promise = require('bluebird')
const Promise = require('bluebird')

const createResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*', // Required for CORS
  },
  body: JSON.stringify(body),
})

export const handler = (event) => {
  let body
  try {
    body = JSON.parse(event.body)
  } catch (e) {
    return Promise.resolve(createResponse(500, e))
  }

  // Check user authorization.
  const claims = getUserClaimsFromLambdaEvent(event)
  const context = createGraphQLContext(claims)

  // Add context to any logs (e.g. the user and request data).
  return loggerContextWrapper(context.user, event, () =>
    graphql({
      schema: Schema,
      source: body.query,
      contextValue: context,
      variableValues: body.variables,
    })
      .then((data) => {
        // Check if the GraphQL response contains any errors, and
        // if it does, handle them.
        // See how express-graphql handles this:
        // https://github.com/graphql/express-graphql/blob/master/src/index.js#L301
        // If graphql-js gets a logger, we can move logging there:
        // https://github.com/graphql/graphql-js/issues/284
        if (data && data.errors) {
          // TODO: fix rule violation
          // eslint-disable-next-line no-param-reassign
          data.errors = data.errors.map((err) => handleError(err))
          return createResponse(500, data)
        }
        return createResponse(200, data)
      })
      .catch((err) => {
        handleError(err)
        return createResponse(500, 'Internal Error')
      })
  )
}

export const serverlessHandler = (event, context, callback) => {
  handler(event).then((response) => callback(null, response))
}
