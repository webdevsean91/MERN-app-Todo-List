import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import './App.css';

import Navbar from "./components/layout/Navbar"
import Landing from "./components/layout/Landing"
import Login from './components/auth/Login'
import Logout from './components/auth/Logout'
import Register from './components/auth/Register'
// import Footer from './components/layout/Footer'
import List from './components/list/List'
import Missing from './components/public/404'
import SimpleStorage from "react-simple-storage"

class App extends Component {
    constructor(props){
        super(props)
        this.state = {
            isLoggedIn: false
            ,isAdminUser: true
            ,name: ""
            ,user_id: null
            ,original_user_id: null // this is to keep track of who originally logged in case they are an admin
            //,prevState: null
        }
        var currentTime = new Date()
        currentTime = currentTime.toISOString()
        console.log("Welcome to my to-do list... please login in or register. " + currentTime)
    }

    // set the state after successfully logging in
    loginCallback = async (result) => {
        await this.setState({
                    isLoggedIn: true
                    ,isAdminUser: result.isAdminUser
                    ,name: result.name
                    ,user_id: result.user_id
                    ,original_user_id: result.user_id
                });
        
        //DEBUG
        //console.log("***** loginCallback state *******")
        //console.log(this.state)
    }

    // set the state after successfully logging out and redirect to the login page
    logoutCallback = async (result) => {
        await this.setState({
            isLoggedIn: false
            ,isAdminUser: false
            ,name: null
            ,user_id: null
            ,original_user_id: null
        });
        //return <Redirect to="/login" />
        window.location = "/login"
    }

    // admin function that switches the user_id and name in state
    switchUserCallback = async (user_id) =>{
        //alert(`App.js:switchUserCallback: ${user_id}`)
        
        //Debug
        //console.log("will run fetch")
        const response = fetch(`http://localhost:9000/api/to_do/auth/${user_id}`, {
            method: 'GET'
        })
        //Debug
        //console.log(this.props.switchUserCallback)
        const theResponse = await response
            , status = await theResponse.status
            , json = await theResponse.json();

        //Debug
        //console.log("****** switchUserCallback ******");
        //console.log(`status: ${status}`);
        //console.log(`json: ${json}`);
        //console.log(json)

        // if the fetch fails
        if (status !== 200) {
            console.log("Error switching user.")
            return false;
        }
        //Debug
        //console.log(`json.name: ${json.name}`)
        //console.log(`json._id: ${json._id}`)

        // the fetch is successful
        await this.setState({
            name: json.name
            ,user_id: json._id
        });
        let result = {
            name: json.name
            ,user_id: json._id
        }
        //this.loginCallback(result)
    }

    render(){
        //this.checkLoggedIn()
        //console.log(`App.js:render:localStorage.jwtToken: ${localStorage.jwtToken}`)
        //localStorage.removeItem("jwtToken")
        var currentTime = new Date()
        currentTime = currentTime.toISOString()
        return (
            <Router>
                <SimpleStorage parent={this} />
                <div className="App">
                    {/* 
                    Using the currentTime to make sure that the Navbar re-renders after login
                    */}
                    <Navbar isLoggedIn={this.state.isLoggedIn} isAdminUser={this.state.isAdminUser} user_id={this.state.user_id}  original_user_id={this.state.original_user_id} switchUserCallback={this.switchUserCallback} key={currentTime} />
                    <Switch>
                        <Route exact path="/"
                            render={(props) => <Landing {...props} isLoggedIn={this.state.isLoggedIn} />}
                            />

                        <Route path="/list"
                            render={(props) => ( !this.state.isLoggedIn ? <Redirect to="/login" /> : <List {...props} isLoggedIn={this.state.isLoggedIn} user_id={this.state.user_id} key={currentTime} />)} />
                        {/* <Route exact path="/list"
                            render={(props) => <List {...props} isLoggedIn={this.state.isLoggedIn} user_id={this.state.user_id} />} /> */}

                        <Route exact path="/login" 
                            render={(props) => (this.state.isLoggedIn ? 
                            <Redirect to="/list" /> : (<Login {...this.props} isLoggedIn={this.state.isLoggedIn} loginCallback={this.loginCallback} />))} />

                        <Route exact path="/logout" 
                            render={ (props) => (<Logout {...this.props} isLoggedIn={this.state.isLoggedIn} logoutCallback={this.logoutCallback} />)}
                            />
                        
                        <Route exact path="/register"
                            render={(props) => (this.state.isLoggedIn ? 
                            <Redirect to="/list" /> : (<Register {...this.props} isLoggedIn={this.state.isLoggedIn} loginCallback={this.loginCallback} />))} />
                        
                        <Route component={Missing} />
                    </Switch>
                    {/* <Footer /> */}
                </div>
            </Router>
        )
    }
}

export default App;
