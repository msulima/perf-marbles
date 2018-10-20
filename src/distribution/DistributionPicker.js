import React from "react";

export default class DistributionPicker extends React.Component {

    render() {
        return <ul>
            <li>
                <label>
                    Exp: <input id="distribution" type="radio" value="exp"
                                checked={this.props.checked === "exp"}
                                onChange={(ev) => this.props.onChange(ev.target.value)}/>
                </label>
            </li>
            <li>
                <label>
                    Uniform: <input id="distribution" type="radio" value="uniform"
                                    checked={this.props.checked === "uniform"}
                                    onChange={(ev) => this.props.onChange(ev.target.value)}/>
                </label>
            </li>
            <li>
                <label>
                    Normal: <input id="distribution" type="radio" value="normal"
                                   checked={this.props.checked === "normal"}
                                   onChange={(ev) => this.props.onChange(ev.target.value)}/>
                </label>
            </li>
        </ul>
    }
}
