import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
class Navbar extends Component {
    constructor(props){
        super(props);
        this.isAdminUser = this.props.isAdminUser;
        this.isLoggedIn = this.props.isLoggedIn;
        this.user_id = this.props.user_id;
        this.original_user_id = this.props.original_user_id
        this.state = {
            userList: []
        }
        this.switchUserCallback = this.props.switchUserCallback;

        //DEBUG
        //console.log("******* Navbar.js:props *******")
        //console.log(props)

        // do we display the Switch User selector? If so grab the query. Did isAdminUser first because more users are likely to NOT be admins 
        if (this.isAdminUser){
            //Debug
            //console.log("isAdminUser")
            if (this.isLoggedIn){
                //Debug
                //console.log("isLoggedIn")  
                (async () => {
                    //Debug
                    //console.log("will run fetch")
                    const response = fetch("http://localhost:9000/api/to_do/auth/users", {
                        method: 'GET'
                    })
                    //Debug
                    //console.log(this.props.switchUserCallback)
                    const theResponse = await response
                        , status = await theResponse.status
                        , json = await theResponse.json();
    
                    // if the fetch fails
                    if (status !== 200) {
                        console.log("Error fetching user list.")
                    }
                    //Debug
                    //console.log(`json.length: ${json.length}`)
                    await this.setState({
                        userList: json
                    })
                })()
            }
        }
        //Debug
        //console.log(`this.props.isAdminUser: ${this.props.isAdminUser}`)
        //console.log(`this.props.isLoggedIn: ${this.props.isLoggedIn}`)
    }
    
    render() {
        var links; // links will vary depending on isLoggedIn status
        var selector; // selector will display for users with isAdminUser
        //Debug
        //console.log("****** Navbar.js:render: this.state.userList *******")
        //console.log(`this.props.isLoggedIn: ${this.props.isLoggedIn}`)
        //console.log(this.state.userList)

        if( this.props.isLoggedIn ){
            // show log out button when logged in
            links = <Link style={{float: 'left'}}
                        to="/logout">
                        <Button variant="outline-success">Log Out</Button>
                    </Link>
            // show the switch user selector when admin
            if( this.props.isAdminUser ){
                selector = <Dropdown style={{float: 'right'}}>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                    Switch User
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onSelect={(event) => this.switchUserCallback(event)} eventKey={this.props.original_user_id} key={this.props.original_user_id}>
                                        <strong>Me</strong>
                                    </Dropdown.Item>
                                    
                                    {this.state.userList.map((item, index, state) => 
                                        { 
                                            //DEBUG
                                            //console.log(`this.props.original_user_id: ${this.props.original_user_id}  this.state.userList[index]._id: ${this.state.userList[index]._id}`)
                                            
                                            if(this.props.original_user_id !== this.state.userList[index]._id){
                                                return (<Dropdown.Item onSelect={(event) => this.switchUserCallback(event)} eventKey={this.state.userList[index]._id} key={this.state.userList[index]._id} style={{}}>
                                                    {this.state.userList[index].name}
                                                </Dropdown.Item>)
                                            }
                                        }
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
            }
        } else {
            // show register and log in button when not logged in
            links = <>
                    <Link
                        to="/register">
                        <Button variant="primary">Register</Button>
                    </Link>
                    &nbsp;
                    <Link
                        to="/login">
                        <Button variant="success">Log In</Button>
                    </Link>
                    </>
        }
        
        return (
            <div className="navbar-fixed">
                <nav className="z-depth-0" style={{backgroundColor: 'white', display: 'block'}}>
                    <div className="nav-wrapper white col-3" style={{float: 'left', height:'60px'}}>
                        {links}
                    </div>
                    <div className="nav-wrapper white col-6 center" style={{float: 'left', height:'60px'}}>
                        <Link
                            to="/"
                            style={{
                                fontFamily: "monospace", fontSize: '3rem', width: 'inherit'
                            }}
                            className="brand-logo black-text center"
                        >CLICK HERE TO TAKE ME HOME</Link>
                    </div>
                    <div className="nav-wrapper white col-3" style={{float: 'left', height:'60px'}}>
                        {selector}
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;