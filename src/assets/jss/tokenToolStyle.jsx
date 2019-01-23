const tokenToolStyle = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 40,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 2,
    marginBottom: "1em"
  },
  migrationTool: {
    marginTop: "30px"
  },
  cardHeader: {
    color: "white",
    backgroundColor: "#FF645C",
    hight: "20px",
    textAlign: "center"
  },
  button: {
    marginBottom: "1em",
    height: "50px"
  },
  rightIcon: {
    marginLeft: theme.spacing.unit * 2,
  },
  content: {
    color: '#153255'
  },
  red: {
    color: '#CE4737'
  },
  green: {
    color: '#51A009'
  },
  input: {
    width: "100%",
    marginTop:"2em",
  },
  text: {
    marginBottom: "1em"
  }
});

export default tokenToolStyle;
