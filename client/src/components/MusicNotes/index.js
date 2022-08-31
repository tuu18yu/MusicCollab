import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import "./styles.css";

function MusicNotes (props) {

    const [display, setDisplay] = useState(new Array(props.references.length).fill(false));

    const handleClick = (idx, event) => {
        let values = [...display];
        values[idx] = !values[idx];
        setDisplay(values);
    }

    const generateReferences = (references) => {
        if(!references) return;
        return references.map((ref, idx) => {
            return (
                <li key={idx}>
                    <div className={"music-note" + ( (idx%2) === 0 ? "" : " margin-88")}>
                        <img className="" src={ref.coverPhoto.imageUrl} alt={"Cover"}/>
                        <button className="work-details-btn" onClick={event => {handleClick(idx, event)}}>
                            <span className="no-display">Feature Details</span>
                        </button>
                        <div className="vertical-purple-line"/>
                            <div className={"details-container" + (display[idx] ? "" : " no-display")}> 
                                <h3>
                                    <Link to={{pathname:`/CoverPage/${ref.title}`, state:{postId: ref._id}}} className="purple-link light-purple">{ref.title}</Link>
                                    {" by " + ref.artist.profileName}
                                </h3>
                                <p>{ref.description}</p>
                            </div>
                        <div className={"tiny-circle" + (display[idx] ? "" : " no-display")}/>
                    </div>
                </li>
            );   
        });
    
    };

    return (
        <div className={"music-notes-container" + (props.grid ? (" " + props.grid): "")}>
            <ul className="music-notes-list">
                {generateReferences(props.references)}
            </ul>
        </div>
    );
}

MusicNotes.propTypes = {
    works: PropTypes.array,
    grid: PropTypes.string
}

export default MusicNotes;