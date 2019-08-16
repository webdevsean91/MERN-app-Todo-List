import React, { Component } from "react";
import { Link } from "react-router-dom";
import setAuthToken from "../utils/setAuthToken"

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            isAdminUser: false,
            errors: {}
        };
        this.onSubmit = this.onSubmit.bind(this)
    }

    // update the state when the input values change
    onChange = async e => {
        await this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault(); // prevent the submit so we can fetch and direct based on that

        const userData = {
            email: this.state.email,
            password: this.state.password,
            isAdminUser: this.state.isAdminUser
        },
        data = new FormData(e.target); // gets what was submitted in the form
        //Debug
        //console.log("****** userData ******");
        //console.log(userData);
        //console.log(data)
        //console.log(this.state)

        // run the fetch and direct or show errors
        (async () => {
            // fetch the register API
            const response = fetch("http://localhost:9000/api/to_do/auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            //console.log("******** params **********")
            
            const theResponse = await response
                , status = await theResponse.status
                , json = await theResponse.json();

            // hide the errorDiv
            document.getElementById("errorDiv").style.display = "none"

            //should only do this when the response is 200 meaning OK
            if (status === 200) {
                // add the token to local storage
                localStorage.setItem("jwtToken", json.token)
                // use token in Auth headers
                setAuthToken(json.token)
                //DEBUG
                //console.log("***** json after fetch ******")
                //console.log(json)
                json["isAdminUser"] = this.state.isAdminUser
                //DEBUG
                //console.log("***** json after isAdminUser ******")
                //console.log(json)
                
                // this callback is because isLoggedIn lives in the App component
                this.props.loginCallback(json)
            }
            else 
            {   // the response contains errors 
                let errorCount = Object.keys(json).length
                //Debug
                //console.log(`errorCount: ${errorCount}`)

                // collect the errors and display them
                if (errorCount) {
                    let displayErrors = ""
                        , i;
                    for (i = 0; i < errorCount; i++) {
                        //Debug
                        //console.log(Object.values(json)[i])
                        displayErrors += `${Object.values(json)[i]}<br />`
                    }

                    if (displayErrors) {
                        console.log("***** Login.js error(s) *****")
                        console.log(displayErrors)
                    }
                    document.getElementById("errorDiv").style.display = "inline"
                    document.getElementById("errors").innerHTML = displayErrors
                    document.getElementById("errors").focus();
                }

                await this.setState((prevState, props) => ({ errors: json }))
            }
        })()
    };

    render() {
        const { errors } = this.state;
        
        return (
            <div className="container">
                <div style={{ marginTop: "2rem" }} className="row">
                    <div className="col s8 offset-s2">
                        <Link to="/" className="btn-flat waves-effect">
                            <i className="material-icons left">keyboard_backspace</i> Take me home
                        </Link>
                        <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                            <h4>
                                <b>Login</b> below and lets get the fun started
                            </h4>
                            <p className="grey-text text-darken-1">
                                Don't have an account?&nbsp;
                                <Link to="/register">Click here to Register </Link>
                            </p>
                        </div>
                        <div id="errorDiv" className="col s12" style={{ paddingLeft: "11.250px", display: 'none' }}>
                            <h4>Errors!!</h4>
                            <p id="errors" className="red-text text-darken-1"></p>
                        </div>
                        <form noValidate onSubmit={this.onSubmit} >
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    error={errors.email}
                                    id="email"
                                    name="email"
                                    type="email"
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password}
                                    error={errors.password}
                                    id="password"
                                    name="password"
                                    type="password"
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                            <div className="input-field col s12">
                                <label htmlFor="isAdminUser">Log in as admin user?<br /> </label><br /><br />
                                <select name="isAdminUser" id="isAdminUser" onChange={this.onChange} style={{display: 'block'}}>
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                </select>
                            </div>
                            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                                <button
                                    style={{
                                        width: "150px",
                                        borderRadius: "3px",
                                        letterSpacing: "1.5px",
                                        marginTop: "1rem"
                                    }}
                                    type="submit"
                                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default Login;