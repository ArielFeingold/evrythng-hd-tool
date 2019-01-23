import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Collapse from '@material-ui/core/Collapse';

import MigrationTool from '../components/MigrationTool'
import TokenTool from '../components/TokenTool'
import MigrationReport from '../components/MigrationReport'

import logo from '../assets/img/hd-logo.png';
import bg from '../assets/img/background-upload2.jpeg';
import loaderPageStyle from '../assets/jss/loaderPageStyle.jsx'


class LoaderPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      users: [],
      usersToSend: [],
      rejectedInputs: [],
      isUploaded: false,
      wasSent: false,
      successfulMigrations: 0,
      tokenActive: true,
      loading: false,
      notSent: []
    };

    this.handleTokenUpload = this.handleTokenUpload.bind(this);
  }

// Token handeling
  componentDidMount() {
    const token = localStorage.getItem("token");
    this.testToken(token);
  }

  handleTokenUpload(token) {
    localStorage.setItem("token", token);
    this.testToken()
  }

  testToken = (token) => {
    const testTokenUser = Object.assign({}, this.state.users[0]);
    const url = `https://api.kustomerapp.com/v1/customers`
    const headers = {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`};

    axios.post(url, testTokenUser, {headers: headers} )
    .then(response => {
      this.setState({
        tokenActive: true
      })
    })
    .catch(error => {
        if(error.status === 409 || error.status === 400){
          this.setState({
            tokenActive: true
          })
        }
        if(error.status === 401) {
          this.setState({
            tokenActive: false,
          })
        }
      }
    )
  }

// CSV upload
  handleUpload = (uploadData) => {
    const dataJson = this.csvJSON(uploadData)
    this.setState({
      users: dataJson,
      isUploaded: true,
      rejectedInputs: [],
      successfulMigrations: 0,
      wasSent: false
    });
  }

  csvJSON = (csv) => {

    const lines=csv.split("\n");
    const resultArray = [];
    const headers=["firstName", "lastName", "email", "birthdayAt", "homePhone", "workPhone", "customerType"];
    for(let i=1; i<lines.length; i++){
  	  const obj = {};
  	  const currentline=lines[i].replace(/, /, "-").split(",");

  	  for(let j=0; j<headers.length; j++){
  		  obj[headers[j]] = currentline[j];
  	  }
  	  resultArray.push(obj);
    }
    for(let result of resultArray){
      result["name"] = `${result.firstName} ${result.lastName}`;
      delete result.firstName;
      delete result.lastName
    }
    return resultArray;
  }

// Data manipulation & migration to Kustomer servers
  handleMigration = (e) => {
    e.preventDefault()
      this.setState({ loading: true, isUploaded: false})
      let rawUsersData = this.state.users;
      let validUsers = this.createUsersToSend(rawUsersData)

      if(this.state.tokenActive) {
        validUsers.forEach((user, index) => {
          setTimeout(() => {
              this.sendInfo(user);
          }, index * 500);
        });
      }
      setTimeout(() => {
        this.setState({ wasSent: true, loading: false  });
      }, validUsers.length * 500)
  }

  createUsersToSend = (dataArray) => {
    const resultArray = [];
    for(let user of dataArray){
      const userInfo = this.createUserInfo(user)

      if(!userInfo.errors) {
        resultArray.push(userInfo)
      }
    }
    return resultArray;
  }

  createUserInfo = (userData) => {
    const obj = {};

    userData.name === " " ? obj.name = null : obj.name = userData.name;

    if(userData.email) {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      const cEmail = userData.email.trim()
      const isValid = this.checkRegex(emailRegex, cEmail)
      if(isValid) {
        obj.emails = [{email: userData.email}]
      } else {
        this.createRejectObject(userData, 412 , "Precondition Failed- email format validation", userData.email, "notSent")
        obj.errors ? obj.errors.push({email: "Format validation failed"}) : obj.errors = [{email: "Format validation failed"}]
      }
    }

    const phoneRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
    obj.phones = [];

    if(userData.workPhone) {
      const cPhone = userData.workPhone.trim()
      const isValid = this.checkRegex(phoneRegex, cPhone)
      if(isValid) {
        obj.phones.push({type: "work", phone: userData.workPhone})
        } else {
        this.createRejectObject(userData, 412, "Precondition Failed- phone format validation", userData.workPhone, "notSent")
        obj.errors ? obj.errors.push({workPhone: "Format validation failed"}) : obj.errors = [{workPhone: "Format validation failed"}]
      }
    }

    if(userData.homePhone) {
      const cPhone = userData.homePhone.trim()
      const isValid = this.checkRegex(phoneRegex, cPhone)
      if(isValid) {
        obj.phones.push({type: "home", phone: userData.homePhone})
      } else {
        this.createRejectObject(userData, 412, "Precondition Failed- phone format validation", userData.homePhone, "notSent")
        obj.errors ? obj.errors.push({homePhone: "Format validation failed"}) : obj.errors = [{homePhone: "Format validation failed"}]
      }
    }

    if(userData.birthdayAt) {
      const isoTime = this.birthdayConverter(userData.birthdayAt);
      obj.birthdayAt = isoTime
    };

    if(userData.customerType.length > 1){
      const tagRegex = /^[0-9a-zA-ZÀ-ÿ_/<>\-.]{1}[0-9a-zA-ZÀ-ÿ _/<>\-.]{0,63}$/
      const cType = userData.customerType.trim()
      const isValid = this.checkRegex(tagRegex, cType)
      obj.tags = []
      if(isValid) {
        obj.tags.push(cType)
        } else {
        this.createRejectObject(userData, 412, "Precondition Failed- customerType format validation", userData.customerType, "notSent")
        obj.errors ? obj.errors.push({customerType: "Format validation failed"}) : obj.errors = [{customerType: "Format validation failed"}]
      }
    };

    return obj;
  }

  async sendInfo(data) {
    const url = `https://api.kustomerapp.com/v1/customers`
    const token = localStorage.getItem("token");
    const headers = {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`};
    axios.post(url, data, {headers: headers} )
    .then(response => {
      this.setState({
        successfulMigrations: this.state.successfulMigrations + 1
      })
    })
    .catch(error => {
      const errorArray = error.response.data.errors;
      for(let err of errorArray) {
        const errUser = JSON.parse(error.config.data);
        this.createRejectObject(errUser, err.status, err.title, err.source.pointer, "rejectedInputs")
      }
    })
  }

  createRejectObject(user, errorCode, errorTitle, errorSource, stateElement) {
    const rejectedUser =
        { user: user,
          error: {
            statusCode: errorCode,
            title: errorTitle,
            source: errorSource
          }
        }
    if(stateElement === "rejectedInputs") {
      this.setState({
        rejectedInputs: [...this.state.rejectedInputs, rejectedUser]
      })
    }
    if(stateElement === "notSent") {
      this.setState({
        notSent: [...this.state.notSent, rejectedUser]
      })
    }
  }

  checkRegex = (expression, value) => {
    if(value === "" || expression.test(value)) {
      return true
    } else {
      return false
    }
  }

  birthdayConverter = (date) => {
    const bday = new Date(date);
    return bday.toISOString()
  }

  resetState = (e) => {
    this.setState ({
      users: [],
      rejectedInputs: [],
      isUploaded: false,
      wasSent: false,
      successfulMigrations: 0,
      notSent: []
    })
  }

  render() {
    const { classes } = this.props;

    return (
        <div
          className={classes.root}
          style={{
            backgroundImage: "url(" + bg + ")",
            backgroundSize: "cover",
            backgroundPosition: "top center"
          }}>

          <TokenTool
            tokenActive={this.state.tokenActive}
            handleTokenUpload={this.handleTokenUpload}
          />

          <AppBar
            className={classes.header}
            position="static"
          >
            <img className={classes.logo} src={logo} alt="Kustomer Logo" />
          </AppBar>

          <AppBar position="static">
            <Collapse in={this.state.isUploaded} collapsedHeight="0px" timeout="auto">
              <div className={classes.successBanner}>Success! {this.state.users.length} customers were imported. Press "MIGRATE" to continue</div>
            </Collapse>
          </AppBar>

          <Grid container justify = "space-evenly">
            <MigrationTool
              handleUpload={this.handleUpload}
              handleMigration={this.handleMigration}
              isUploaded={this.state.isUploaded}
              />

            <MigrationReport
              reset={() => this.resetState()}
              rejectedInputs={this.state.rejectedInputs}
              notSent={this.state.notSent}
              wasSent={this.state.wasSent}
              successfulMigrations={this.state.successfulMigrations}
              isLoading={this.state.loading}
              loaderLength  ={this.state.users.length}
            />
          </Grid>
        </div>
      );
    }
  }

  LoaderPage.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(loaderPageStyle)(LoaderPage);
