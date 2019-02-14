import React, {Component} from 'react';

class TextSubmit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            url: ''
        };
    }
    onTextChange = (e) => {
        this.setState({text: e.target.value});
    }
    onSubmit = () => {
        const url = 'http://localhost:5000/api/submitText';
        const data = {text: this.state.text};
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(response => { this.setState({url: response.url})})
        .catch(error => {
            this.setState({url: ''});
            console.log('Error: ', error)
        });
    }
    render() {
        const urlContent = this.state.url.length>0 ? 'Your URL is: ' + this.state.url : '';
        return (
            <div>
                <p>Input text and click Submit button</p>
                <textarea
                    style={{minHeight: "30vh", minWidth: "60vh"}}
                    value={this.state.text}
                    onChange={this.onTextChange}
                />
                <hr/>
                <button onClick={this.onSubmit}>
                    Submit
                </button>
                <hr/>
                <span><a href={this.state.url}>{urlContent}</a></span>
            </div>
        )
    }
}

export default TextSubmit;