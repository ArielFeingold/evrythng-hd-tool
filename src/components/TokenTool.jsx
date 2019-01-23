import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Grid from '@material-ui/core/Grid';
import CardHeader from '@material-ui/core/CardHeader';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import tokenToolStyle from '../assets/jss/tokenToolStyle.jsx'

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

class SimpleModal extends React.Component {
  state = {
    open: false,
    token: ""
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleChange = (event) => {
    this.setState({token: event.target.value});
  }

  handleTokenUpload = (e) => {
    e.preventDefault()
    let token = this.state.token
    this.props.handleTokenUpload(token)
  }


  render() {
    const { classes } = this.props;

    return (
      <div>
        <Modal
          open={!this.props.tokenActive}
        >
          <Card tyle={getModalStyle()} className={classes.migrationTool}>
            <CardHeader
                classes ={{title: classes.cardHeader, root: classes.cardHeader }}
                title="Invalid Token"
              />

              <CardContent>
                <Typography variant="h5" gutterBottom className={classes.content} >
                  Token validation failed, To procced, please enter a valid token below.
                </Typography>
                <OutlinedInput
                  className={classes.input}
                  value={this.state.token}
                  onChange={this.handleChange}
                  labelWidth= {0}
                />

                <Grid container justify = "center">
                  <label htmlFor="raised-button-file">
                    <form onSubmit={this.handleTokenUpload}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      type="submit"
                      >
                        send
                      <CloudUploadIcon className={classes.rightIcon} />
                    </Button>
                  </form>
                </label>
              </Grid>
            </CardContent>
          </Card>
        </Modal>
      </div>
    );
  }
}

SimpleModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(tokenToolStyle)(SimpleModal);
