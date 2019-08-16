import React from 'react';
const theImage = require('./404.png');

const Missing = (props) => {
    
    
    return (
        <div style={{padding: '50px'}}>
            <div className="container">
                <h1 className="display-3">OOPS!</h1>
                <p>Sorry! Can't find that resource. Please check your URL.</p>
            </div>
            <div style={{width: '99%', marginLeft: 'auto', marginRight: 'auto'}}>
                <a href="https://www.starwars.com"><img src={theImage} width="120%" alt="404.png" /></a>
            </div>
        </div>
    )
}

export default Missing
