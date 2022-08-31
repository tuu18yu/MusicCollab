import React from 'react';
import ProfileViewHeader from '../../components/ProfileHeader/ProfileViewHeader';
import PropTypes from 'prop-types';
import FollowList from '../../components/FollowList';
import { useLocation } from 'react-router';


function FollowsView (props) {
    const location = useLocation();
    const {header, list, externalView} = location.state;
    return (
        <div className="page">
            <ProfileViewHeader externalView={externalView} currentUser={props.currentUser} page={header === 'Followings'? 'followings':'followers'}/>
            <FollowList header={header} list={list}/>
        </div>
    );
}

FollowsView.propType = {
    currentUser: PropTypes.object
};

export default FollowsView;