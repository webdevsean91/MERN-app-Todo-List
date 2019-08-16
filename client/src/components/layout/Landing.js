import React, { Component } from "react";
import image from './full.png';

class Landing extends Component {
    constructor(props) {
        super(props)
        this.isLoggedIn = this.props.isLoggedIn
    }

    render() {
        return (
            <div style={{ height: "75vh", verticalAlign: 'baseline' }} className="center-align">
                <div style={{ verticalAlign: 'baseline' }}>
                <h4>
                    This <b>To-do</b> list was built using the {" "}
                    <span style={{ fontFamily: "monospace", fontWeight: 'bold', fontSize: 'larger' }}>MERN</span> stack
                </h4>
                <img src={image} alt='full.png' />
                </div>
            </div>
        );
    }
}
export default Landing;