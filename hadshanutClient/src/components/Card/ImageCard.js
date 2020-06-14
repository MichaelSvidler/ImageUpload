import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles({
  media: {
    marginTop: '2vh',
    height: '50vh',
    width: '30vw',
    borderRadius: '5px',
    alignSelf: 'center',
    boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
   },
   container : {
    position: 'relative',
    '&:hover': {
      '& img' : {
        filter: 'blur(4px)'
      }
    }
   },
   butt: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    MsTransform: 'translate(-50%, -50%)',
    backgroundColor: '#555',
    color: 'white',
    fontSize: '16px',
    padding: '12px 24px',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px'
    }
});

const ImageCard = (props) => {
  const classes = useStyles();
  const [removeImage, setRemoveImage] = useState(false);

  var blob = new Blob( [ new Uint8Array(props.image.data.data) ], { type: "image/png" } );
  var imageUrl = URL.createObjectURL( blob );
  
  return (
  <div className={classes.container} 
        onMouseEnter = {()=> setRemoveImage(true) }
        onMouseLeave = {()=> setRemoveImage(false) }> 
    <img 
        className={classes.media}
        src={imageUrl}
       />
      {removeImage && <button className={classes.butt} onClick = {()=> props.deleteImage(props.image.imageId) }> DELETE</button>}
  </div>
  );
}

export default ImageCard;