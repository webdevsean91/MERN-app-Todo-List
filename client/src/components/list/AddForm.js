import React from '../../../node_modules/react';
import Button from '../../../node_modules/react-bootstrap/Button';
import Form from '../../../node_modules/react-bootstrap/Form';

class AddForm extends React.Component{
    constructor(props){
        super(props);

        this.state = {value: ''}; // state is local to this compoonent and will not include the counter from the parent component
        this.handleChange = this.handleChange.bind(this);
    }

    // update state when the input value changes
    handleChange(event) {
        this.setState({value: event.target.value});
        event.stopPropagation();
    }

    // when submitting call the onClick function
    handleSubmit() {
        this.props.onClick();
        this.setState({value: ""});
    }

    render(){
        return(
            <Form onSubmit={e => { e.preventDefault(); this.handleSubmit();}}>
                <Form.Group controlId="AddForm">
                    <Form.Label>What needs to be done?</Form.Label>
                    <Form.Control ref={this.props.useRef} onChange={this.handleChange} required type="text" placeholder="I need to..." value={(this.state.value)} />
                    <br />
                    <Button variant="primary" onClick={() => this.handleSubmit()}>
                        Add # {this.props.counter} 
                    </Button>
                </Form.Group>
            </Form>
        )
    }
}
export default AddForm;