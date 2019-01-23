import React from 'react'
import { withStyles } from '@material-ui/core/styles';

import importPickerStyle from '../assets/jss/importPickerStyle.jsx'

const ImportPicker= (props) => {
    let fileReader;
    const { classes } = props;

    let pickerText = !props.isUploaded ? "Coose a file to upload" : "Click the button below to begin migration"

    const handleFileRead = (e) => {
        const content = fileReader.result;
        props.onFileUpload(content);
        e.target.value = null;;
    };

    const handleFileChosen = (file) => {
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
    };

    return <div className={classes.picker}>
        <input type='file'
              name="file"
              id="file"
              hidden
              accept=".csv"
              className='input-file'
              onChange={e => handleFileChosen(e.target.files[0])}
        />
        <label htmlFor="file">{pickerText}</label>

    </div>;
};

export default withStyles(importPickerStyle)(ImportPicker);
