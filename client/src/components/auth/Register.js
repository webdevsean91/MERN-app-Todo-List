import React, { Component } from "react";
import { Link } from "react-router-dom";

class Register extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            password2: "",
            administratorFlag: false,
            displayErrors: "",
            errors: {}
        }
    }

    // update the state when the input values change
    onChange = async e => {
        await this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault(); // prevent the submit so we can fetch and direct based on that

        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2,
            administratorFlag: this.state.administratorFlag
        };
        //Debug
        //console.log("submitting")
        (async () => {
            // fetch the register API
            const response = fetch("http://localhost:9000/api/to_do/auth/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            })
            const   theResponse = await response
                    ,status = await theResponse.status
                    ,json = await theResponse.json();
            
            // hide the errorDiv
            document.getElementById("errorDiv").style.display = "none"
            
            // do this when the fetch fails
            if(status !== 200){
                let errorCount = Object.keys(json).length
                //Debug
                //console.log(`errorCount: ${errorCount}`)

                // collect the errors and display them
                if( errorCount ){
                    let displayErrors = ""
                        ,i;
                    for (i = 0; i < errorCount; i++){
                        //Debug
                        //console.log(Object.values(json)[i])
                        displayErrors += `${Object.values(json)[i]}<br />`
                    }
                    
                    if(displayErrors){
                        console.log("***** Register.js error(s) *****")
                        console.log(displayErrors)
                        await this.setState({
                            errors: json
                        })
                    }
                    document.getElementById("errorDiv").style.display = "inline"
                    document.getElementById("errors").innerHTML = displayErrors
                    document.getElementById("errors").focus();
                }
                
                await this.setState({errors: json})
            }else{
                window.location = '/login'
            }
        })()
    };

    render() {
        const { errors } = this.state;
        return (
            <div className="container">
                <div className="row">
                    <div className="col s8 offset-s2">
                        <Link to="/" className="btn-flat waves-effect">
                            <i className="material-icons left">keyboard_backspace</i> Take me back home
                        </Link>
                        <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                            <h4>
                                <b>Register</b> below and lets get started, WHOOP WHOOP!!!
                            </h4>
                            <p className="grey-text text-darken-1">
                                Already have an account?<br/>
                                Then leave this for the newbies.  <Link to="/login">Click here to Login</Link>
                            </p>
                        </div>
                        <div id="errorDiv" className="col s12" style={{ paddingLeft: "11.250px", display: 'none' }}>
                            <h4>Errors!!</h4>
                            <p id="errors" className="red-text text-darken-1"></p>
                        </div>
                        <form noValidate id="registerUserForm" onSubmit={this.onSubmit}>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    error={errors.name}
                                    id="name"
                                    type="text"
                                />
                                <label htmlFor="name">Name</label>
                            </div>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    error={errors.email}
                                    id="email"
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
                                    type="password"
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password2}
                                    error={errors.password2}
                                    id="password2"
                                    type="password"
                                />
                                <label htmlFor="password2">Confirm Password</label>
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
                                    Sign up
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default Register;