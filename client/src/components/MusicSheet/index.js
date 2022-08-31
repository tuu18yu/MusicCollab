import React from 'react';
import PropTypes from 'prop-types';
import "./styles.css";
import MusicNotes from '../MusicNotes';

function MusicSheet(props) {

    const lineClass = props.top ? "vertical-white-Line grid1 height-620" : "vertical-white-Line grid1";
    const marginClass = props.top ? "white-line margin-bottom-300" : "white-line";
    const titleClass = props.top ? "sheet-section-title grid1 left-110" : "sheet-section-title grid1";

    return(
            <div className="grid">
                    
                <div className="music-row grid1">
                    <div className="white-line"/>
                    <div className="white-line"/>
                    <div className={marginClass}/>
                </div>

                <div className={lineClass}/>
                <div className="vertical-white-Line grid1 left-300"/>
                <h2 className="sheet-section-num grid1"> {props.references.length} </h2>
                <h2 className={titleClass}> {props.top ? "Works Featured" : "Works Featured In"} </h2>

                <MusicNotes references={props.references} grid="grid1"/>
            </div>
        );
}

MusicSheet.propTypes = {
    references: PropTypes.array,
    top: PropTypes.bool
};

export default MusicSheet;