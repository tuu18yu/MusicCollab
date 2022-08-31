import React from 'react';
import PropTypes from 'prop-types';

function FormRow(props) {
    return (
        <div className="row">
            <label className="input-label">{props.label}</label>
            <input type={props.type} name={props.name} className={props.className} value={props.value}
                onChange={props.handleChange} placeholder={props.placeholder ? props.placeholder : ""}/>
        </div>
    );
}

FormRow.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    className: PropTypes.string,
    handleChange: PropTypes.func,
    placeholder: PropTypes.string
};

export default FormRow;