import React from "react";

export default class NumberInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const value = event.target.value;
        this.setState({
            value,
        });
        this.props.onChange(parseInt(value));
    }

    render() {
        return <p>
            <label>
                {this.props.label}:{' '}
                <input type="number" value={this.state.value} onChange={this.handleInputChange}/>
            </label>
        </p>;
    }
}
