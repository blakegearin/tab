import React from 'react'
import PropTypes from 'prop-types'

import EditWidgetChip from '../../EditWidgetChip'
import TextField from 'material-ui/TextField'
import appTheme from 'theme/default'

class AddTodoForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
  }

  _handleKeyPress (e) {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.stopPropagation()
        e.preventDefault()
        this.create()
      }
    }
  }

  openForm () {
    this.setState({
      open: true
    })
  }

  closeForm () {
    this.setState({
      open: false
    })
  }

  create () {
    const text = this.todoTextField.input.refs.input.value
    if (!text) { return }

    this.props.addTodo(text)
    this.todoTextField.input.value = ''
    this.closeForm()
  }

  render () {
    const textField = {
      underlineStyle: {
        borderColor: appTheme.textField.underlineColor
      },
      underlineFocusStyle: {
        borderColor: appTheme.textField.underlineFocusStyle
      },
      hintStyle: {
        color: appTheme.textField.underlineColor,
        fontSize: 14
      },
      inputStyle: {
        color: '#FFF',
        fontSize: 14
      },
      errorStyle: {
        color: appTheme.textField.underlineColor
      }
    }

    return (
      <EditWidgetChip
        open={this.state.open}
        widgetName={'Todos'}
        onAddItemClick={this.openForm.bind(this)}
        onCancelAddItemClick={this.closeForm.bind(this)}
        onItemCreatedClick={this.create.bind(this)}
        widgetAddItemForm={
          <span
            key={'widget-add-form-elem'}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingBottom: 10
            }}
          >
            <TextField
              ref={(input) => { this.todoTextField = input }}
              multiLine
              onKeyPress={this._handleKeyPress.bind(this)}
              hintText='What do you need to do?'
              textareaStyle={textField.inputStyle}
              hintStyle={textField.hintStyle}
              underlineStyle={textField.underlineStyle}
              underlineFocusStyle={textField.underlineFocusStyle}
              errorStyle={textField.errorStyle}
            />
          </span>
        }
       />
    )
  }
}

AddTodoForm.propTypes = {
  addTodo: PropTypes.func.isRequired
}

AddTodoForm.defaultProps = {
}

export default AddTodoForm
