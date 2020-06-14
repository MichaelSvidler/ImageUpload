import React, {useState} from "react";
import {withRouter } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import axios from '../../axios';

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
      display: "flex",
      flexDirection: "column",
    },
  },
  field: {
    display: "flex",
  },
  div: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  button: {
    backgroundColor: '#89B0AE',
    color: 'white'
  }
}));

  const Login = (props) => {
  const classes = useStyles();

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [massege, setMassege] = useState(null);

  const loginHandler = () => {
    axios.post('/login', {'username': userName, 'password': password})
    .then(response => {
      console.log(response.data);
      if (response.data.login) {
        props.history.push({
          pathname: '/upload',
          state: { username: userName, userId: response.data.userId  }
        })
      } else {
        setMassege(<div style={{color: 'red'}}> שגיאה בשם המשתמש או/ו בסיסמה, אנא נסה שנית</div>) ;
      }
    })
    .catch(error => {
      console.log(error);
      setMassege(<div> Error, please try again</div>) ;
    })
  }

  return (
    <div dir="rtl" className={classes.div}>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField
          label="User Name"
          variant="outlined"
          className={classes.field}
          value={userName}
          onChange = {(event) => setUserName(event.target.value)}
        />
        <TextField label="Password" 
                  variant="outlined"
                  className={classes.field} 
                  value={password}
                  type="password"
                  onChange = {(event) => setPassword(event.target.value)} />
      </form>
      <Button variant="contained" 
              className={classes.button} 
              onClick={loginHandler} 
              disabled = {userName === '' || password === '' }>
        Log in
      </Button>
      {massege}
    </div>
  );
};

export default withRouter(Login);
