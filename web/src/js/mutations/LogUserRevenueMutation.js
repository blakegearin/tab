import graphql from 'babel-plugin-relay/macro'
import { commitMutation } from 'react-relay'
import environment from 'js/relay-env'

const mutation = graphql`
  mutation LogUserRevenueMutation($input: LogUserRevenueInput!) {
    logUserRevenue(input: $input) {
      success
    }
  }
`

export default input => {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: input,
    },
  })
}
