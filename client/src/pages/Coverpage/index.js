import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import "./styles.css";



function Coverpage (props) {

    const[editMode, setEditMode] = useState(false);
    const[editBtnVal, setEditBtnVal] = useState('Edit');

    const generateWorks = (works) => {
        if(!works) return;
        return works.map((work, idx) => {
            return (
                <li key={idx}>
                    <img src={work.imgSrc} alt='work cover'/>
                    <Link className="profile-works-link" to={{
                        pathname:'/',
                        id: work.id
                    }}>{work.title}</Link> 
                </li>
            );   
        });
    
    };

const cover = () => { return (
                                <div className="large-dark-box">
                                    <h3 className="box-title">Song Cover</h3>
                                    <div className="profile-works">
                                        <ul className="small-works-list">
                                        {generateWorks(props.currentUser.works)}
                                        </ul>

                                    </div>
                                </div>
    );};


return (
        <div id="profile-content">
            {!props.externalView}
            {cover()}
           
            
        </div>
    )

}

Coverpage.propTypes = {
    currentUser: PropTypes.object,
    externalView: PropTypes.bool,
}

export default Coverpage;
