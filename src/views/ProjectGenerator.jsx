import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import AppBar from '@material-ui/core/AppBar';
import Collapse from '@material-ui/core/Collapse';
import Card from "../components/Card/Card.jsx";
import CardBody from "../components/Card/CardBody.jsx";
import CardHeader from "../components/Card/CardHeader.jsx";
import GridContainer from "../components/Grid/GridContainer.jsx";
import GridItem from "../components/Grid/GridItem.jsx";

import logo from '../assets/img/hd-logo.png';
import signupPageStyle from '../assets/jss/views/signupPageStyle.jsx'


class SignupPage extends Component {


  render() {
    const { classes } = this.props;

    return (
        <div>
          <AppBar
            className={classes.header}
            position="static"
          >
            <img className={classes.logo} src={logo} alt="HD Logo" />
          </AppBar>
       <GridContainer style={{marginTop:"2rem"}} justify="center">
            <GridItem xs={12} sm={12} md={6}>
                <Card>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>Signup</h4>
                    </CardHeader>
                    <CardBody>
                         <form className={classes.form} noValidate autoComplete="off">
                        <TextField
                        id="first-name"
                        label="First Name"
                        style={{ margin: 8 }}
                        placeholder="Enter First Name"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        />
                        <TextField
                        id="last-name"
                        label="Last Name"
                        style={{ margin: 8 }}
                        placeholder = "Enter Last Name"
                        helperText="Full width!"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        />
                        <TextField
                        id="email"
                        label="Email"
                        style={{ margin: 8 }}
                        placeholder="Enter Valid Email Address"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        />
                        <TextField
                        id="password"
                        label="Password"
                        style={{ margin: 8 }}
                        placeholder="8 Characters Minimum"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        />
                        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.button}>
                            Signup
                        </Button>
                      </form>                   
                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer>
        </div>
      );
    }
  }

  SignupPage.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(signupPageStyle)(SignupPage);
