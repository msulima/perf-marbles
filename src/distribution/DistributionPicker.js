import React from "react";

export default class DistributionPicker extends React.Component {

    render() {
        return <ul>
            <li>
                <label>
                    <input id="distribution" type="radio" value="uniform"
                           checked={this.props.checked === "uniform"}
                           onChange={(ev) => this.props.onChange(ev.target.value)}/> uniform
                </label>
            </li>
            <li>
                <label>
                    <input id="distribution" type="radio" value="exp"
                           checked={this.props.checked === "exp"}
                           onChange={(ev) => this.props.onChange(ev.target.value)}/> exponential
                </label>
            </li>
        </ul>
    }
}
