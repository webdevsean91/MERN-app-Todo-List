import React from 'react';

class Header extends React.Component{
    shouldComponentUpdate(){
        return false;
    }
    
    render(){
        return(
            <h1>TODO</h1>
        )
    }
}
export default Header;