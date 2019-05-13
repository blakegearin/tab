/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import SettingsPage from 'js/components/Settings/SettingsPageComponent'
// import AccountView from 'js/components/Settings/Account/AccountView'
// import BackgroundSettingsView from 'js/components/Settings/Background/BackgroundSettingsView'
// import ErrorMessage from 'js/components/General/ErrorMessage'
// import Logo from 'js/components/Logo/Logo'
// import ProfileStatsView from 'js/components/Settings/Profile/ProfileStatsView'
// import ProfileDonateHearts from 'js/components/Settings/Profile/ProfileDonateHeartsView'
// import ProfileInviteFriend from 'js/components/Settings/Profile/ProfileInviteFriendView'
// import SettingsMenuItem from 'js/components/Settings/SettingsMenuItem'
// import WidgetsSettingsView from 'js/components/Settings/Widgets/WidgetsSettingsView'

jest.mock('js/components/Settings/Account/AccountView')
jest.mock('js/components/Settings/Background/BackgroundSettingsView')
jest.mock('js/components/General/ErrorMessage')
jest.mock('js/components/Logo/Logo')
jest.mock('js/components/Settings/Profile/ProfileStatsView')
jest.mock('js/components/Settings/Profile/ProfileDonateHeartsView')
jest.mock('js/components/Settings/Profile/ProfileInviteFriendView')
jest.mock('js/components/Settings/SettingsMenuItem')
jest.mock('js/components/Settings/Widgets/WidgetsSettingsView')
jest.mock('js/components/General/withUser')

afterEach(() => {
  jest.clearAllMocks()
})

const getMockProps = () => ({})

describe('SettingsPage', () => {
  it('renders without error', () => {
    const mockProps = getMockProps()
    shallow(<SettingsPage {...mockProps} />).dive()
  })
})
