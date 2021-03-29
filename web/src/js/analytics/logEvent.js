import fbq from 'js/analytics/facebook-analytics'
import GA from 'js/analytics/google-analytics'
import rdt from 'js/analytics/reddit-analytics'
import logger from 'js/utils/logger'

// We automatically track most pageviews on location change.
// See ./withPageviewTracking higher-order component.
export const pageview = () => {
  fbq('track', 'PageView')
}

export const homepageView = () => {
  fbq('track', 'ViewContent', { content_name: 'Homepage' })
  fbq('track', 'PageView')
}

export const signupPageButtonClick = () => {
  fbq('track', 'Lead', { content_name: 'SignupButtonClick' })
}

export const signupPageSocialButtonClick = () => {
  fbq('track', 'Lead', { content_name: 'SocialSignupButtonClick' })
}

export const signupPageEmailButtonClick = () => {
  fbq('track', 'Lead', { content_name: 'EmailSignupButtonClick' })
}

export const accountCreated = () => {
  fbq('track', 'CompleteRegistration', { content_name: 'AccountCreated' })
  rdt('track', 'SignUp')
}

export const searchExecuted = () => {
  // Need to wait for events to fire before navigating
  // away from the page.
  // https://support.google.com/analytics/answer/1136920?hl=en
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#hitCallback
  return new Promise(resolve => {
    // Using the original ga object because hitCallback isn't
    // implemented in react-ga for events:
    // https://github.com/react-ga/react-ga#reactgaga
    GA.ga('send', {
      hitType: 'event',
      eventCategory: 'Search',
      eventAction: 'SearchExecuted',
      hitCallback: resolve,
    })

    // In case GA fails to call the callback within a
    // reasonable amount of time, continue so we don't
    // interrupt the search.
    setTimeout(() => {
      resolve()
    }, 200)
  })
}

// TODO: later
// export const emailVerified = () => {
//   // GA and fbq pageviews
//   fbq('track', 'PageView')
//   GA.pageview()
// }

export const newTabView = () => {
  // No Google Analytics because of rate limiting.
  fbq('track', 'PageView')
  fbq('track', 'ViewContent', { content_name: 'Newtab' })
}

export const searchForACauseAccountCreated = () => {
  try {
    fbq('track', 'CompleteRegistration', {
      content_name: 'SearchAccountCreated',
    })
    rdt('track', 'Search')

    // A note about Quora, in case we reimplement its pixel in the future:
    // It can cause fatal errors when paired with react-snap pre-rendering:
    // "Quora Pixel Error: Base pixel code is not installed properly."
    // Be cautious about implementing it on the Search app.
  } catch (e) {
    logger.error(e)
  }
}
