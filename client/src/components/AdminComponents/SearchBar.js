import React from 'react';
import './styles.css';

class SearchBar extends React.Component {

    state = {
        keyword: ""
    }

    handleInputChange = (event) => {
        const target=event.target
        const value=target.value

        this.setState({
            keyword: value
        })

        this.props.parentCallBack(value)
    }

    render() {
        return(
            <div className='searchBar'>
                <input type="text" 
                    name='keyword' 
                    placeholder="Search" 
                    value={ this.state.keyword }
                    onChange={ this.handleInputChange }
                />
            </div>
        )
    }
}


export default SearchBar