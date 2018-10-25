import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import { getTasks, createTask, deleteTask } from './todoService';

const styles = theme => ({
  root: {
    width: '360px',
    backgroundColor: theme.palette.background.paper,
  },

  centeredContainer: {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },

  title: {
    textAlign: 'center',
    paddingTop: '24px;',
    paddingBottum: '24px'
  },

  createTask: {
    display: 'inline-flex',
    paddingLeft: '39px',
    paddingRight: '24px',
    paddingBottom: '28px'
  },

  createButton: {
    paddingLeft: '6px',
    alignSelf: 'flex-end'
  },

  createInput: {
    width: '200px'
  }
});

class Index extends React.Component {
  state = {
    message: '',
    open: false,
    createLabel: '',
    checked: [0],
    tasks: []
  };

  componentDidMount() {
    getTasks().then(tasks => {
      this.setState({ tasks });
    });
  }

  onValueChanged = event => {
    console.log(event.target)
    this.setState({ createLabel: event.target.value });
  };

  handleCreate = value => () => {
    createTask(value)
      .then(getTasks)
      .then(tasks => {
        this.setState({
          message: 'created task',
          open: true,
          tasks
        });
      });
  };

  handleDelete = id => () => {
    deleteTask(id)
      .then(getTasks)
      .then(tasks => {
        this.setState({
          message: 'Deleted task',
          open: true,
          tasks
        });
      });
  };

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value.id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value.id);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
      createLabel: ''
    });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.centeredContainer}>
        <div className={classes.root}>
          <Typography component="h2" variant="headline" className={classes.title}>
            TODO
          </Typography>

          <div className={classes.createTask}>
            <div>
              <FormControl>
                <InputLabel htmlFor="create-label">Label</InputLabel>
                <Input
                  id="create-label"
                  label="Task Label"
                  className={classes.createInput}
                  value={this.state.createLabel}
                  onChange={this.onValueChanged}
                />
              </FormControl>
            </div>

            <div className={classes.createButton}>
              <Button color="primary" onClick={this.handleCreate(this.state.createLabel)}>create</Button>
            </div>
          </div>

          <Divider />

          <List>
            {this.state.tasks.map(value => (
              <ListItem key={value.id} dense button onClick={this.handleToggle(value)}>
                <Checkbox
                  checked={this.state.checked.indexOf(value.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemText primary={`${value.name}`} />
                <ListItemSecondaryAction>
                  <IconButton aria-label="Comments" onClick={this.handleDelete(value.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.open}
          autoHideDuration={1000}
          onClose={this.handleClose}
          message={<span id="message-id">{this.state.message}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
