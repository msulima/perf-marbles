import React from "react";

export default class NumberInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleChange(event) {
        this.setState({
            value: parseInt(event.target.value),
        });
    }

    handleBlur() {
        this.props.onChange(this.state.value);
    }

    render() {
        return <p>
            <label>
                {this.props.label}:{' '}
                <input type="number" value={this.state.value} onBlur={this.handleBlur} onChange={this.handleChange}/>
            </label>
        </p>;
    }
}
