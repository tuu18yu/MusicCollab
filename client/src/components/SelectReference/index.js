import React from 'react';
import PropTypes from 'prop-types';
import Multiselect from 'multiselect-react-dropdown';
import './styles.css';

function SelectReference(props) {

    return (
        <Multiselect isObject={true} options={props.options} onSelect={props.handleSelect}
            onRemove={props.handleSelect} selectionLimit={props.selectLimit} displayValue="name" hidePlaceholder={true}
            selectedValues = {props.selectedOptions} placeholder={props.placeholder ? props.placeholder : "Select"}/>
    );

}

SelectReference.propTypes = {
    options: PropTypes.array,
    handleSelect: PropTypes.func,
    selectedOptions: PropTypes.array,
    selectLimit: PropTypes.number,
    placeholder: PropTypes.string
}

export default SelectReference;