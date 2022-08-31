import React, { useState, useEffect } from 'react';
import EditCoverPhoto from '../EditCoverPhoto';
import "./styles.css";
import FormRow from '../FormRow';
import SelectCategories from '../SelectCategories';
import SelectReference from '../SelectReference';
import PropTypes from 'prop-types';
import { getPostsWithIds, updatePost } from '../../actions/post';


function EditWorkDetails (props) {

    
    const defaultFormInputs = {
        title: props.currentPost.title,
        references: (props.currentPost.references.length === 0) ?  [{id: null, description: "", name: null}] : props.currentPost.references,
        categories: props.currentPost.categories,
        hashtags: props.currentPost.tags,
        audio: props.currentPost.audio.audioUrl,
        description: props.currentPost.description,
        coverImage: props.currentPost.coverPhoto.imageUrl,
        originalImage: "",
        originalAudio: "",
        imageId: props.currentPost.coverPhoto.imageId,
        audioId: props.currentPost.coverPhoto.audioId,
        postId: props.currentPost.id

    };

    const [defaultSelectedReferences, setDefaultSelectedReferences] = useState()
    const [uploadFormInputs, setUploadFormInputs] = useState(defaultFormInputs);
    const [audioLabel, setAudioLabel] = useState("Click this area to select a new audio file (Max Size 10MB)");
    const [selectedRefWork, setSelectedRefWork] = useState();
    const [downloadedWorks, setDownloadedWorks] = useState([]);

    useEffect(()=> {

        getPostsWithIds(props.currentUser.downloadedWorks, setDownloadedWorks);

    }, [props.currentUser])

    useEffect(()=> {
        const refs = props.currentPost.references.map(work => {
            return {name: work.name, id: work.id}
        });

        setDefaultSelectedReferences(refs)
        setSelectedRefWork([refs])

    }, [props.currentPost])


    const downloads = downloadedWorks.map(work => {
        return {name: work.title + " by " + work.artist.profileName, id: work._id }});


    // const saveChanges = () => {
    //     props.setInfo(['title', uploadFormInputs.title])
    //     props.setInfo(['references', uploadFormInputs.references])
    //     props.setInfo(['categories', uploadFormInputs.categories])
    //     props.setInfo(['hashtags', uploadFormInputs.hashtags])
    //     props.setInfo(['audio', uploadFormInputs.audio])
    //     props.setInfo(['description', uploadFormInputs.description])
    //     props.setInfo(['imgSrc', uploadFormInputs.coverImage])
    // }

    const handleInputChange = (event) => {
        const name = event.target.name;
        let value;
        if(name === "hashtags") {
            value = event.target.value.split(/[ #]+/);
        } else if(name === "coverImage") {
            const image = event.target.files[0];
            if(image) {
                if(image.size <= 10000000) {
                    value = URL.createObjectURL(image);
                    const name2 = "originalImage";
                    setUploadFormInputs(inputs => ({...inputs, [name]: value, [name2]: event.target.files[0]}));
                }
                else {
                    alert("The file you selected is too large!");
                    return;
                }
            } else {
                return;
            }
        }
        else {
            value = event.target.value;
        }

        setUploadFormInputs(inputs => ({...inputs, [name]: value}));
    };

    const handleCategoryChange = (categoriesList) => {
        const name = 'categories';
        setUploadFormInputs(inputs => ({...inputs, [name]: categoriesList}));
    };

    const handleRefAdd = (event) => {
        event.preventDefault();
        const references = [...uploadFormInputs.references, {id: null, description: ""}];
        const name = 'references';
        setUploadFormInputs(inputs => ({...inputs, [name]: references}));
        const works = [...selectedRefWork, []];
        setSelectedRefWork(works);
    }

    const handleRefRemove = (idx, event) => {
        event.preventDefault();
        const name = 'references';
        let references = [...uploadFormInputs.references];
        references.splice(idx,1);
        setUploadFormInputs(inputs => ({...inputs, [name]: references}));
        let works = [...selectedRefWork];
        works.splice(idx,1);
        setSelectedRefWork(works);
      }

      const handleAudioChange = (event) => {
        if(event.target.files.length){
            if(event.target.files[0].size <= 10000000){
                console.log(event.target.files);
                const name = "audio";
                const name2 = "originalAudio";
                const value = URL.createObjectURL(event.target.files[0]);
                setUploadFormInputs(inputs => ({...inputs, [name]: value, [name2]:event.target.files[0]}));
                setAudioLabel(event.target.files[0].name);
            }
            else {
                alert("The file you selected is too large!")
            }
        }
    }

    const handleRefSelect = (idx, workId, workName, selectedWork) => {
        let references = [...uploadFormInputs.references];
        references[idx].id = workId;
        references[idx].name = workName;
        const name = 'references';
        setUploadFormInputs(inputs => ({...inputs, [name]: references}));
        let works = [...selectedRefWork];
        works[idx] = selectedWork;
        setSelectedRefWork(works);
    }

    const handleDescriptionChange = (idx, event) => {
        let references = [...uploadFormInputs.references];
        references[idx].description = event.target.value;
        const name = 'references';
        setUploadFormInputs(inputs => ({...inputs, [name]: references}));
    }

    const handleUpload = (event) => {
        //a post request will be made with the upload form data, including the cover image
        event.preventDefault();
        console.log("about to upload")

        if(uploadFormInputs["audio"] === "" || uploadFormInputs["coverImage"] === "" || uploadFormInputs["title"] === "") {
            alert("Your work was not uploaded. Try again");
            //setUploadFormInputs(defaultFormInputs);
            //setSelectedRefWork([defaultSelectedReferences]);
            //setAudioLabel("Click this area to select a new audio file (Max Size 10MB)");
            return;
        }

        let formData = new FormData();

        for ( var key in uploadFormInputs ) {
            if(key !== "coverImage"  && key !== "audio") {
                if(key === "references") {
                    let value = (uploadFormInputs[key] && (uploadFormInputs[key].id !== null)) ? JSON.stringify(uploadFormInputs[key]) : JSON.stringify([])
                    formData.append(key, value);
                }
                else if(key === "hashtags" || key === "categories"){
                    formData.append(key, JSON.stringify(uploadFormInputs[key]));
                }
                else {
                    formData.append(key, uploadFormInputs[key]);
                }
                
            }
        }

        for (var value of formData.values()) {
            console.log(value);
        }

        try {
            updatePost(formData)
            
        }
        catch (error) {
            console.log(error)
            alert("Your work was not uploaded. Try again");
        }
        props.updateUser()
        //setUploadFormInputs(defaultFormInputs);
        //setSelectedRefWork([defaultSelectedReferences]);
        //setAudioLabel("Click this area to select a new audio file (Max Size 10MB)");
    }

    return(
        <div id="edit-upload-page"> 
            <div id="work-details">
                <div id="header-container">
                    <h2 className="page-title">Edit Post</h2>
                </div>

                <div id="details-container">
                    <form id="upload-form">
                        <FormRow label={"Title"} type={"text"} className={"input-box"} value={uploadFormInputs.title} 
                            handleChange={handleInputChange} name={"title"}/>
                        <br/>
                        <div className="row">
                            <label className="input-label">Categories</label>
                            <SelectCategories selectedValues={defaultFormInputs.categories} disabled={false} handleSelect={handleCategoryChange}/>
                        </div>
                        <br/>
                        <FormRow label={"Hashtags"} type={"text"} className={"input-box"} value={uploadFormInputs.hashtags.join(" #")} 
                            handleChange={handleInputChange} name={"hashtags"} placeholder={"#hashtag1 #hashtag2"}/>
                        <br/>
                        <div className="row">
                            <label className="input-label">Audio File</label>
                            <label className="input-box" id="audio-file-label" htmlFor="audio-file">{audioLabel}</label>
                            <input id="audio-file" type="file" accept=".mp3, .wav" onChange={handleAudioChange}/>
                        </div>
                        <br/>
                        <div className="row">
                            <label className="input-label">Description</label>
                            <textarea className="description-text-box" name="description" value={uploadFormInputs.description} onChange={handleInputChange}/>
                        </div>
                        <br/>
                        <div className="row">
                            <label className="input-label">Referenced Works</label>
                                {uploadFormInputs.references.map((ref, idx) => {
                                    return (
                                        <div className="add-ref-box" key={idx}> 
                                            <SelectReference options={downloads} selectedOptions={[defaultSelectedReferences][idx]}
                                                handleSelect={selectedWork => handleRefSelect(idx, selectedWork.length ? selectedWork[0].id : "", selectedWork.length ? selectedWork[0].name : "", selectedWork)}/>
                                            <textarea className="description-text-box ref-description" name="description" value={uploadFormInputs.references[idx].description}
                                                onChange={event => handleDescriptionChange(idx, event)} placeholder={"How did you use this work?"}/>
                                            {uploadFormInputs.references.length > 1 && <button className="remove-ref-btn red-box-btn"
                                                                                            onClick={event => handleRefRemove(idx, event)}>-</button>}
                                            <button className="add-ref-btn" onClick={handleRefAdd}>+</button>
                                        </div>
                                    );
                                })}
                        </div>
                    </form>
                </div>
            </div>
            <EditCoverPhoto currentPost={props.currentPost} coverImageSrc={uploadFormInputs.coverImage} handleImgChange={handleInputChange} handleUpload={handleUpload}/>
        </div>
    );

}

EditWorkDetails.propTypes = {
    currentUser: PropTypes.object,
    currentPost: PropTypes.object,
    setInfo: PropTypes.func,
    updateUser: PropTypes.func
};

export default EditWorkDetails;