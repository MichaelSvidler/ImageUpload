import React, { Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import axios from '../../axios';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import ImageCard from 'components/Card/ImageCard';

const useStyles = theme => ({
    div: {
        display: 'flex',
        flexDirection: "column",
        height: '100%',
        width: '100%',
        scroll: 'hidden'
    },
    title: {
        fontSize: '3vw',
        alignSelf: 'center'
    }, 
    imageUploader: {
        display: 'flex',
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    inputFile: {
        margin: 'auto',
        marginTop: '5vh',
        alignSelf: 'center',
        backgroundColor: '#FFD6BA',
    },
    uploadButton : {
        width: '5vw',
        height: '5vh',
        margin: 'auto', 
        marginTop: '2vh',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%',
        scroll: 'visible'
    }, 
    logoutButton: {
        width: '10vw',
        height: '7vh',
        backgroundColor: '#FFD6BA',
        color: 'black',
        marginRight: theme.spacing(2),
        fontSizw: '2vh'
    },
    root: {
        flexGrow: 1,
    },
    appTitle: {
        flexGrow: 1,
    },
    appBar: {
        backgroundColor: '#555B6E',
        height: '10vh',
    }, 
    hr: { 
        backgroundColor: '#555B6E',
        width: '100%',
        height: '2px'
    }
  });

class ImageUploader extends Component {

    state = {
        selectedFile : null,
        userImages: null,
        uploadMassage: '',
        deleteMessage : '',
        displayImages : false
    }

    componentDidMount () {
        axios.get('/images', {
            params: {
              userId: this.props.location.state.userId
            }
          }).then(response => {
            this.setState({userImages: response.data})
        })
        .catch (error=> {
            console.log(error);
        });
    }

    fileSelectHandler = event => {
        this.setState({selectedFile: event.target.files[0]})
    }

    fileUploadHandler = () => {
        const fd = new FormData();
        fd.append('image', this.state.selectedFile,  this.state.selectedFile.name);
        fd.append('userId', this.props.location.state.userId);
        axios.post('/image', fd)
        .then(response => {
            console.log(response);
            this.setState({uploadMassage: 'התמונה הועלתה בהצלחה!'});
            let newImages = [...this.state.userImages, {data: response.data.data.data, imageId: response.data.imageId}];
            this.setState({ userImages: newImages });
        })
        .catch (error=> {
            console.log(error);
            this.setState({uploadMassage: 'קרתה טעות מצערת והתמונה לא עלתה, נסה שנית'});
        })  
    }

    imageDeleteHandler = (imageId) => {
        axios.post('/image/delete', {'imageId': imageId})
        .then(response => {
            console.log(response);
            this.setState({deleteMessage: 'The image was successfuly deleted'})
        })
        .catch (error=> {
            console.log(error);
            this.setState({deleteMessage: 'Oops! something went wrong, please try again'})
        });

        let newImages = [...this.state.userImages];
        const array = newImages.filter( (image) => {
            return image.imageId !== imageId;
        })
        
        this.setState ({userImages: array});
    }

    render () {
        const { classes } = this.props;

        return (
           <>
            <div className={classes.div} dir='rtl'>
                <div className={classes.root}>
                <AppBar position="static" className= {classes.appBar}>
                    <Toolbar> 
                    <Typography variant="h6" className={classes.appTitle}>
                        Hello {this.props.location.state.username} !
                    </Typography>
                    <Button  className={classes.logoutButton} 
                        variant="contained" 
                        color="secondary"
                        onClick = {()=>  this.props.history.push('/login')}> Log Out </Button>
                    </Toolbar>
                </AppBar>
                </div>
               
                <div className={classes.imageUploader}> 
                    <span className={classes.title}> Upload an Imange </span> 
                    <input className={classes.inputFile} 
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={this.fileSelectHandler}></input>
                    <Button className={classes.uploadButton} 
                    variant="contained" 
                    color="secondary"
                    disabled= {this.state.selectedFile == null}
                    onClick = {this.fileUploadHandler}> Upload </Button>
                </div>
                <div> {this.state.uploadMassage}</div>

                <hr className={classes.hr}/>

                <div className={classes.title} > My Images  </div>
                {this.state.displayImages ?  
                    <>
                        <IconButton onClick={ () => this.setState({displayImages: false})}> 
                                <ArrowUpwardIcon />
                        </IconButton>
                        <div className={classes.container}>
                            
                            {this.state.userImages && this.state.userImages.map((image, index)=> {
                                return <ImageCard key={index} 
                                                  image={image}
                                                  deleteImage={this.imageDeleteHandler}/> 
                            })}
                        </div>
                    </>
                   : 
                    <IconButton onClick={ () => this.setState({displayImages: true})}> 
                        <ArrowDownwardIcon />
                    </IconButton>}
                
            </div>
           </>
        )
    }
}

export default withStyles(useStyles)(ImageUploader);