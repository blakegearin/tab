import graphql from 'babel-plugin-relay/macro'
import commitMutation from 'relay-commit-mutation-promise'
import environment from 'js/relay-env'

const mutation = graphql`
  mutation LogVideoAdCompleteMutation($input: LogVideoAdCompleteInput!) {
    logVideoAdComplete(input: $input) {
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
