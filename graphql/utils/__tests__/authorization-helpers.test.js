/* eslint-env jest */

import {
  createGraphQLContext,
  getUserClaimsFromLambdaEvent,
  permissionAuthorizers,
} from '../authorization-helpers'

describe('authorization-helpers', () => {
  it('correctly gets user claims from AWS Lambda event obj', () => {
    const claims = {
      id: 'abc123',
      email: 'foo@bar.com',
      email_verified: 'true',
      auth_time: 1,
    }
    const minimalLambdaEventObj = {
      requestContext: {
        authorizer: { ...claims },
      },
    }
    const fetchedClaims = getUserClaimsFromLambdaEvent(minimalLambdaEventObj)
    expect(fetchedClaims).toEqual(claims)
  })

  it('creates expected GraphQL context', () => {
    const userClaims = {
      id: 'abc123',
      email: 'foo@bar.com',
      email_verified: 'true',
      auth_time: 1,
    }
    const expectedContext = {
      user: {
        id: 'abc123',
        email: 'foo@bar.com',
        emailVerified: true,
        authTime: 1,
      },
    }
    const context = createGraphQLContext(userClaims)
    expect(expectedContext).toEqual(context)
  })
})

describe('permission authorizer functions', () => {
  const user = {
    id: 'abcdefghijklmno',
    email: 'abc@example.com',
    emailVerified: true,
    authTime: 1,
  }

  test('userIdMatchesHashKey works if user ID matches hash key', () => {
    expect(
      permissionAuthorizers.userIdMatchesHashKey(user, 'abcdefghijklmno')
    ).toBe(true)
  })

  test('userIdMatchesHashKey fails if user ID does not match hash key', () => {
    expect(
      permissionAuthorizers.userIdMatchesHashKey(
        user,
        '95bbefbf-63d1-4d36-931e-212fbe2bc3d9'
      )
    ).toBe(false)
  })
})
