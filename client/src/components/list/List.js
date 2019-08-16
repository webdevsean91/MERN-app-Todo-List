import React from 'react';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import AddForm from './AddForm.js';

class List extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            counter: 1
            ,listItems: []
            ,errors: {}
        };
        this.addItem = this.addItem.bind(this);
        // create a reference to pass down to the input form
        this.textInputRef = React.createRef();
        this.emptyVar = "";

        //Debug
        //console.log(`List.js:constructor: this.props in List.js ${JSON.stringify(this.props)}`);
    }

    // get the list items for the user
    fetchList = async () => {
        //Debug
        //console.log(`List.js:fetchList: this.props in List.js ${JSON.stringify(this.props)}`);
        const response = fetch(`http://localhost:9000/api/to_do/${this.props.user_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/html'
            },
            body: this.state.user_id
        })
        
        const theResponse = await response
            , status = await theResponse.status
            , json = await theResponse.json();

        //should only do this when the response is 200 meaning OK
        if (status === 200) {
            await this.setState({
                listItems: json
                ,counter: json.length + 1
            })
        }
        else 
        {
            let errorCount = Object.keys(json).length
            //Debug
            //console.log(`errorCount: ${errorCount}`)

            if (errorCount) {
                let displayErrors = ""
                    , i;
                for (i = 0; i < errorCount; i++) {
                    //console.log(Object.values(json)[i])
                    displayErrors += `${Object.values(json)[i]}<br />`
                }

                if (displayErrors) {
                    console.log("***** List.js:fetchList error(s) *****")
                    console.log(displayErrors)
                }
                document.getElementById("errorDiv").style.display = "inline"
                document.getElementById("errors").innerHTML = displayErrors
                document.getElementById("errors").focus();
            }

            await this.setState({ errors: json })
        }
    }

    // this was add item when I was handling the list without a DB
    /* addItem(){
        // get the value from the input and add it to the state.listItems array
        // also increment state.counter
        let value = this.textInputRef.current.value;
        //console.log('adding: ' + value);
        this.setState(state => {
            const listItems = state.listItems.concat(value);
            const counter = state.counter + 1;
            return {
                counter
                ,listItems
            };
        })
        this.textInputRef.current.value = "";
    } */

    addItem(){
        (async () => {

            // set up the string to send to the API
            const ToDoData = `user_id=${this.props.user_id}&to_do=${this.textInputRef.current.value}`

            //Debug
            //console.log(`List.js:addItem: ${ToDoData}`)

            const response = fetch("http://localhost:9000/api/to_do/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: ToDoData
            })
            
            const   theResponse = await response
                    ,status = await theResponse.status
                    ,json = await theResponse.json();

            //Debug
            //console.log("List.js:addItem")
            //console.log(theResponse)
            //console.log(json);
            
            //should only do this when the response is 200 meaning OK
            if (status === 200) {
                // refresh the list in order to reload the component
                this.fetchList();
            }
            else 
            {
                // the response contains errors 
                let errorCount = Object.keys(json).length
                //Debug
                //console.log(`errorCount: ${errorCount}`)

                // collect the errors and display them
                if (errorCount) {
                    let displayErrors = ""
                        , i;
                    for (i = 0; i < errorCount; i++) {
                        //console.log(Object.values(json)[i])
                        displayErrors += `${Object.values(json)[i]}<br />`
                    }

                    if (displayErrors) {
                        console.log("***** List.js:addItem error(s) *****")
                        console.log(displayErrors)
                    }
                    document.getElementById(`errorDiv`).style.display = "inline"
                    document.getElementById(`errors`).innerHTML = displayErrors
                    document.getElementById(`errors`).focus();
                }

                await this.setState({ errors: json })
            }
        })()
    }

    componentDidMount(){
        // refresh the list in order to reload the component
        this.fetchList();
    }

    removeItem = function(id, res){
        // confirm that they want to delete
        if(window.confirm("Are you sure you want to delete this task?")){
            
            (async () => {
                // the response below is for testing a delete for an item that does not exist
                //const response = fetch("http://localhost:9000/api/to_do/5d4338f3453e3257ea84fd09", {
                
                const response = fetch(`http://localhost:9000/api/to_do/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'text/html'
                    },
                    body: `errorDiv${id}`
                })
                
                const   theResponse = await response
                        ,status = await theResponse.status
                        ,json = await theResponse.json();
    
                //should only do this when the response is 200 meaning OK
                if (status === 200) {
                    // refresh the list in order to reload the component
                    this.fetchList();
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
                            console.log("***** List.js:removeItem error(s) *****")
                            console.log(displayErrors)
                        }
                        //Debug
                        //console.log(`List.js:removeItem: errorDiv${id}`)
                        document.getElementById(`errorDiv${id}`).style.display = "inline"
                        document.getElementById(`errors${id}`).innerHTML = displayErrors
                        document.getElementById(`errors${id}`).focus();
                    }
    
                    await this.setState({ errors: json })
                }
            })()
        }
    }

    render(){
        
        // need to do this because performing map on this.state.listItems after it becomes empty throws an error
        const listItems = this.state.listItems.length ? this.state.listItems : [];
        
            return(
                <>
                    <div className="col-4 offset-4">
                        <ListGroup style={{marginLeft: '-50px', width: '400px'}}>
                            {listItems.map((item, index, state) => {
                                
                                return(
                                    <>
                                    <ListGroup.Item key={listItems[index]._id}>
                                        <span style={{float: 'left'}} className="col-9">{listItems[index].to_do}</span>
                                        <span style={{float: 'right'}} className="col-3">
                                            <Button variant="danger" value={listItems[index]._id} onClick={() => this.removeItem(listItems[index]._id)}>Delete</Button>
                                        </span>
                                    </ListGroup.Item>
                                    <span id={`errorDiv${listItems[index]._id}`} key={`errorDiv${listItems[index]._id}1`} style={{float: 'right'}} className="col-12">
                                        <p id={`errors${listItems[index]._id}`} key={`errors${listItems[index]._id}2`} className="red-text text-darken-1"></p>
                                    </span>
                                    </>
                                )
                            })}
                        </ListGroup>
                        <br />
                        <AddForm counter={this.state.counter} useRef={this.textInputRef} onClick={() => this.addItem()} value={this.emptyVar} />
                    </div>
                    <div id="errorDiv" className="col s12" style={{ paddingLeft: "11.250px", display: 'none' }}>
                        <h4>Errors!!</h4>
                        <p id="errors" className="red-text text-darken-1"></p>
                    </div>
                </>
            )
    }
}
export default List;