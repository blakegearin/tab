import logger from '../../utils/logger'
import getUserFeature from '../experiments/getUserFeature'
import {
  SHFAC_NOTIFY_FULLPAGE_AUG,
  USER_SURVEY_AUGUST_2023,
} from '../experiments/experimentConstants'

/**
 * Get data for notifications the user should see.
 * @param {object} userContext - The user authorizer object.
 * @param {string} user - UserModel object.
 * @return {Notifications[]} An array of notification data, or an empty
 *   array.
 */

const getUserNotifications = async (userContext, user) => {
  let notifications = []

  // Survey notifications
  try {
    const notifFeature = await getUserFeature(
      userContext,
      user,
      USER_SURVEY_AUGUST_2023
    )

    notifications = [
      ...notifications,
      {
        code: USER_SURVEY_AUGUST_2023,
        variation: notifFeature.variation,
      },
    ]
  } catch (e) {
    logger.error(e)
  }

  // Only show the notification if the user has not signed up for a shop yet.
  if (user.shopSignupTimestamp) {
    return notifications
  }

  try {
    const notifFeature = await getUserFeature(
      userContext,
      user,
      SHFAC_NOTIFY_FULLPAGE_AUG
    )

    notifications = [
      ...notifications,
      {
        code: SHFAC_NOTIFY_FULLPAGE_AUG,
        variation: notifFeature.variation,
      },
    ]
  } catch (e) {
    logger.error(e)
  }

  return notifications
}

export default getUserNotifications
