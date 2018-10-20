import React from "react";

export default class ParametersPicker extends React.Component {

    render() {
        const beta = this.props.betaEnabled ?
            <label>
                Beta: <input id="max" type="number" value={this.props.beta}
                             onChange={(ev) => this.props.onChangeBeta(parseInt(ev.target.value))}/>
            </label> : null;
        return <p>
            <label>
                Mean: <input id="min" type="number" value={this.props.mean}
                             onChange={(ev) => this.props.onChangeMean(parseInt(ev.target.value))}/>
            </label>
            {beta}
        </p>;
    }
}
