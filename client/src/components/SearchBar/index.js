import React from 'react';
import './styles.css'

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
    }

    render() {
        return(
            <div className='searchBar'>
                <input type="text" 
                    name='keyword' 
                    placeholder="Search Songs" 
                    value={ this.state.keyword }
                    onChange={ this.handleInputChange }
                />
                <button type="submit">Search</button>
            </div>
        )
    }
}


export default SearchBar
