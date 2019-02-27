import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles,
} from '@material-ui/core/styles'
import CircleIcon from '@material-ui/icons/Lens'
import theme from 'js/theme/defaultV1'
import MoneyRaised from 'js/components/MoneyRaised/MoneyRaisedContainer'
import Hearts from 'js/components/Dashboard/HeartsContainer'
import SettingsButton from 'js/components/Dashboard/SettingsButtonComponent'

const defaultTheme = createMuiTheme(theme)

const styles = {
  circleIcon: {
    // color: 'rgba(255, 255, 255, 0.8)',
    color: 'rgba(0, 0, 255, 0.8)',
    alignSelf: 'center',
    width: 5,
    height: 5,
    marginTop: 2,
    marginLeft: 12,
    marginRight: 12,
  },
}

class UserMenu extends React.Component {
  render() {
    const { app, classes, user, isUserAnonymous } = this.props
    return (
      <MuiThemeProvider
        theme={{
          ...defaultTheme,
          palette: {
            ...defaultTheme.palette,
            background: {
              ...defaultTheme.palette.background,
              paper: '#ff0000',
            },
            // divider: 'rgba(255, 255, 255, 0.20)',
            divider: 'rgba(0, 255, 0, 0.90)',
          },
          typography: {
            ...defaultTheme.typography,
            h2: {
              ...defaultTheme.typography.h2,
              // color: 'rgba(255, 255, 255, 0.8)',
              color: 'rgba(0, 0, 255, 0.8)',
            },
            h3: {
              ...defaultTheme.typography.h3,
              color: '#fff',
            },
            h4: {
              ...defaultTheme.typography.h4,
              color: '#fff',
            },
            h5: {
              ...defaultTheme.typography.h5,
              color: '#fff',
            },
            body2: {
              ...defaultTheme.typography.body2,
              color: '#fff',
            },
          },
          overrides: {
            ...defaultTheme.overrides,
            MuiListItemIcon: {
              ...get(defaultTheme, 'overrides.MuiListItemIcon', {}),
              root: {
                ...get(defaultTheme, 'overrides.MuiListItemIcon.root', {}),
                color: '#fff',
              },
            },
            MuiButtonBase: {
              ...get(defaultTheme, 'overrides.MuiButtonBase', {}),
              root: {
                ...get(defaultTheme, 'overrides.MuiButtonBase.root', {}),
                color: '#ffff00',
              },
            },
            MuiTypography: {
              ...get(defaultTheme, 'overrides.MuiTypography', {}),
              h2: {
                ...get(defaultTheme, 'overrides.MuiTypography.h2', {}),
                '&:hover': {
                  // color: '#fff',
                  color: '#00ff00',
                },
              },
            },
          },
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <MoneyRaised app={app} />
          <CircleIcon className={classes.circleIcon} />
          <Hearts app={app} user={user} />
          <SettingsButton isUserAnonymous={isUserAnonymous} />
        </div>
      </MuiThemeProvider>
    )
  }
}

UserMenu.propTypes = {
  app: PropTypes.shape({}).isRequired,
  classes: PropTypes.object.isRequired,
  isUserAnonymous: PropTypes.bool,
  user: PropTypes.shape({}).isRequired,
}

UserMenu.defaultProps = {
  isUserAnonymous: false,
}

export default withStyles(styles)(UserMenu)
