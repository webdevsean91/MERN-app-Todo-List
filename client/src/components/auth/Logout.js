import React from 'react';
import setAuthToken from "../utils/setAuthToken";

// this is a simple component that simply logs the user out but doesn't display anything
class Logout extends React.Component {
    constructor(props){
        super(props)
        this.logoutCallback = this.props.logoutCallback

        
        // remove token from localStorage
        localStorage.removeItem("jwtToken")
        // remove token used in auth header
        setAuthToken(false)

        // callback will take care of the isLoggedIn state
        this.logoutCallback({message: "Logged out"})
    }

    render(){
        //return window.location = "/login"
        return <></>
    }
}

export default Logout;