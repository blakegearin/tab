import { init } from 'next-firebase-auth'
import './fetch-polyfill'

const initAuth = ({
  firebaseProjectId,
  firebasePrivateKey,
  firebaseClientEmail,
  firebaseDatabaseURL,
  firebasePublicAPIKey,
  cookieKeys = [],
}) => {
  // FIXME: remove after debugging
  // eslint-disable-next-line no-console
  console.log('===== Init NFA. Cookie keys:', cookieKeys)

  init({
    debug: true, // FIXME: reset to false after debugging
    firebaseAdminInitConfig: {
      credential: {
        projectId: firebaseProjectId,
        clientEmail: firebaseClientEmail,
        privateKey: firebasePrivateKey,
      },
      databaseURL: firebaseDatabaseURL,
    },
    firebaseClientInitConfig: {
      apiKey: firebasePublicAPIKey,
    },
    cookies: {
      name: 'TabAuth',
      keys: cookieKeys,
      secure: true,
      signed: true,
    },
    onTokenRefreshError: e => {
      // eslint-disable-next-line no-console
      console.error('NFA onTokenRefreshError:', e)
    },
    onVerifyTokenError: e => {
      // eslint-disable-next-line no-console
      console.error('NFA onVerifyTokenError:', e)
    },
  })
}

export default initAuth
