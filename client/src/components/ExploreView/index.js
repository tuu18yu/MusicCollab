import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import "./styles.css";

function ExploreView (props) {

    const generateWorks = (works) => {
        if(!works) return;
        return works.map((work, idx) => {
            return (
                <li key={idx}>
                    <Link to={{
                        pathname:`/CoverPage/${work.title}`,
                        state: { postId: work._id }
                    }}>
                        <img id="large-img" src={work.coverPhoto.imageUrl} alt='work cover'/>
                    </Link>
                    <Link className="profile-works-link" to={{
                                pathname: `/CoverPage/${work.title}`,
                                state: { postId: work._id }
                                }}>{work.title}</Link>
                    <p className="hashtag">{work.tags.join(" #")}</p>
                </li>
            );   
        });
    
    };

    const worksBox = (works) => { return (
        <div className="large-dark-box-explore">
            <h3 className="box-title">{props.title}</h3>
            <div className="profile-works">
                <ul className="small-works-list">
                {generateWorks(works)}
                </ul>
            </div>
        </div>
    );};

    return (
        worksBox(props.works)
    );



}

ExploreView.propTypes = {
    works: PropTypes.array,
    title: PropTypes.string
};

export default ExploreView;