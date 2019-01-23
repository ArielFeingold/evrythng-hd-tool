import React from 'react'
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import migrationToolStyle from '../assets/jss/migrationToolStyle.jsx'

import ImportPicker from './ImportPicker'

const MigrationTool= (props) => {
    const { classes } = props;

    return(
      <Grid item xs={12} sm={4}>
        <Card className={classes.migrationTool}>
          <CardHeader
              classes ={{title: classes.cardHeader, root: classes.cardHeader }}
              title="Kustomer Migration Tool"
            />
            <CardContent>
              <Typography variant="h5" className={classes.content} >
                Choose a CSV File for import
              </Typography>
            </CardContent>
          <Grid >
            <ImportPicker
              onFileUpload={props.handleUpload}
              isUploaded={props.isUploaded}
              />
            </Grid>
          <Grid container justify = "center">
            <label htmlFor="raised-button-file">
              <form onSubmit={props.handleMigration}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.button}
                type="submit"
                disabled={!props.isUploaded}
                >
                  Migrate
                <CloudUploadIcon className={classes.rightIcon} />
              </Button>
            </form>
          </label>
        </Grid>
      </Card>
    </Grid>
  )
};


export default withStyles(migrationToolStyle)(MigrationTool);
