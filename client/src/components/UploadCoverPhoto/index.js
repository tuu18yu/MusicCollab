import React from 'react';
import "./styles.css";
import PropTypes from 'prop-types';

function UploadCoverPhoto(props) {

    return(
        <div id="upload-container">
            <div id="cover-photo-container">
                <img id="cover-photo-upload" src={props.coverImageSrc} alt={"Cover"}/>
                <label id="change-cover-photo-label" htmlFor="photo">Select Cover Photo</label>
                <input name="coverImage" id="photo" type="file" accept=".png, .jpg, .jpeg" onChange={props.handleImgChange}/>
            </div>
            <button type="submit" form="upload-form" className="btn" id="upload-btn" onClick={props.handleUpload}>Upload</button>
        </div>
        

    );
    
}

UploadCoverPhoto.propTypes = {
    coverImageSrc: PropTypes.string,
    handleImgChange: PropTypes.func,
    handleUpload: PropTypes.func
}

export default UploadCoverPhoto;