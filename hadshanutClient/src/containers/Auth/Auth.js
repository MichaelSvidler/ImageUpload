import React, { Component} from 'react';
import { withStyles } from '@material-ui/core/styles';

import Login from 'components/Login/Login';

const useStyles = theme => ({
    title: {
        fontSize: '8vw',
        color: '#555B6E'
    },
    div: {
        display : 'flex',
        flexDirection : 'column',
        alignItems: 'center',
        marginTop: '10vh' 
    }
  });

class Auth extends Component {

    loginHandler = () => {
        this.props.history.push('/upload');
    }

    render () {
        const { classes } = this.props;

        return (
           <div className={classes.div}>
                <div className={classes.title} dir='rtl'>
                    Welcome
                </div>
                <Login login={this.loginHandler}/>
           </div>
        )
    }
}

export default withStyles(useStyles)(Auth);