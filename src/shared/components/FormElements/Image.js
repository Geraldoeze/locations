import React, { useRef, useState, useEffect } from 'react';
import Button from './Button/Button';

import './ImageUpload.css';

const imageMimeType = /image\/(png|jpg|jpeg)/i;

const ImageUpload = props => {
    const filePickerRef = useRef();

    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);


    const pickImageHandler = () => {
        filePickerRef.current.click();
    };

    
    const pickedHandler = event => {
        let pickedFile;
        let fileIsValid = isValid;//this enables us to pass a change-able state when needed
        if (event.target.files || event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            if (!pickedFile.type.match(imageMimeType)) {
                alert("Image mime type is not valid");
                return;
              }
            
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true;
        } else {
            setIsValid(false);
            fileIsValid = false;
        }

        props.onInput(props.id, pickedFile, fileIsValid)
    };

  
    useEffect(() => {
        if (!file) {
            return;
        }
        let fileReader, isCancel = false;
        fileReader = new FileReader();
        fileReader.onload = (e) => {
          const { result } = e.target;
          if (result && !isCancel) {
            setPreviewUrl(result)
          }
        }
        fileReader.readAsDataURL(file);

        
        return () => {
            isCancel = true;
            if (fileReader && fileReader.readyState === 1) {
              fileReader.abort();
            }
          }

    }, [file]);
    

    return (
        <div className='form-control'>
            <input 
              ref={filePickerRef}
              id={props.id} 
              style={{display: 'none'}} 
              type="file" 
              accept=".jpg, .png, .jpeg"
              onChange={pickedHandler}
            />
          <div className={`image-upload ${props.center && 'center'}`}>
              <div className='image-upload__preview'>
                  {previewUrl && <img src={previewUrl} alt="Preview" width='100%' height='100%' />}
                  {!previewUrl && <p>Please pick an image.</p>}
              </div>
              <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
          </div>
          {!isValid && <p>{props.errorText}</p>}
        </div>
    )

}

export default ImageUpload;

