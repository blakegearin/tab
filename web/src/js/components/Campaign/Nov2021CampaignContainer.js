import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import TreePlantingCampaign from 'js/components/Campaign/TreePlantingCampaignComponent'

export default createFragmentContainer(TreePlantingCampaign, {
  app: graphql`
    fragment TreePlantingCampaignContainer_app on App {
      campaign {
        goal {
          currentNumber
        }
      }
    }
  `,
  user: graphql`
    fragment TreePlantingCampaignContainer_user on User
      @argumentDefinitions(
        startTime: { type: "String" }
        endTime: { type: "String" }
      ) {
      recruits(first: 5000, startTime: $startTime, endTime: $endTime) {
        recruitsWithAtLeastOneTab
      }
      ...InviteFriendContainer_user
    }
  `,
})
