import DynamoDBModel from '../base/DynamoDBModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { CHARITY } from '../constants'
import config from '../../config'

const mediaRoot = config.MEDIA_ENDPOINT

/*
 * Represents a Charity.
 * @extends DynamoDBModel

 */
class Charity extends DynamoDBModel {
  static get name() {
    return CHARITY
  }

  static get hashKey() {
    return 'id'
  }

  static get tableName() {
    return tableNames.charities
  }

  static get schema() {
    const self = this
    return {
      id: types.uuid(),
      name: types.string(),
      category: types.string(),
      logo: types.string(),
      image: types.string(),
      imageCaption: types.string(),
      website: types.string().uri(),
      description: types.string(),
      impact: types.string(),
      inactive: types
        .boolean()
        .default(self.fieldDefaults.inactive)
        .description(
          `If true, we will behave like the charity is not in the database.`
        ),
      isPermanentPartner: types
        .boolean()
        .default(self.fieldDefaults.isPermanentPartner)
        .description(
          `Whether to show the charity on the "Donate Hearts" page and elsewhere`
        ),
      longformDescription: types.string(),
    }
  }

  static get fieldDefaults() {
    return {
      inactive: false,
      isPermanentPartner: false,
    }
  }

  static get permissions() {
    return {
      get: () => true,
      getAll: () => true,
    }
  }

  static get fieldDeserializers() {
    return {
      logo: (fileName) =>
        `${mediaRoot}/img/charities/charity-logos/${fileName}`,
      image: (fileName) =>
        `${mediaRoot}/img/charities/charity-post-donation-images/${fileName}`,
    }
  }
}

Charity.register()

export default Charity
