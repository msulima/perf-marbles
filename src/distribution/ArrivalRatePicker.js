import React from "react";
import DistributionPicker from "./DistributionPicker";
import ParametersPicker from "./ParametersPicker";

export default class ArrivalRatePicker extends React.Component {

    static getInitialState() {
        return mapToState(ArrivalRatePicker.getInitial());
    }

    static getInitial() {
        return {
            distribution: "uniform",
            mean: 250,
            beta: 200,
        };
    }

    constructor(props) {
        super(props);
        this.state = ArrivalRatePicker.getInitial();
        this.handleChangeDistribution = this.handleChangeDistribution.bind(this);
        this.handleChangeMean = this.handleChangeMean.bind(this);
        this.handleChangeBeta = this.handleChangeBeta.bind(this);
        this.handleChangeBeta = this.handleChangeBeta.bind(this);
    }

    handleChangeDistribution(distribution) {
        this.setState({
            distribution,
        });
    }

    handleChangeMean(mean) {
        this.setState({
            mean,
        });
    }

    handleChangeBeta(beta) {
        this.setState({
            beta,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.distribution !== this.state.distribution || prevState.mean !== this.state.mean || prevState.beta !== this.state.beta) {
            this.props.onChangeDistribution(mapToState(this.state));
        }
    }

    render() {
        return <fieldset>
            <DistributionPicker checked={this.state.distribution} onChange={this.handleChangeDistribution}/>
            <ParametersPicker mean={this.state.mean} beta={this.state.beta}
                              onChangeMean={this.handleChangeMean} onChangeBeta={this.handleChangeBeta}/>
        </fieldset>;
    }
}

function mapToState(state) {
    return {
        generator: distribution(state.distribution).bind(null, state.mean, state.beta),
        arrivalRate: 1000 / state.mean,
    };
}

function distribution(name) {
    switch (name) {
        case "uniform":
            return uniform;
        case "normal":
            return normal;
        case "exp":
            return exp;
    }
}

function uniform(mean, beta) {
    return mean + (Math.random() - 0.5) * 2 * beta;
}

function normal(mean, beta) {
    return gaussianRand() * mean * 2;
}

function exp(mean) {
    return -Math.log(Math.random()) * mean;
}

function gaussianRand() {
    let rand = 0;

    for (let i = 0; i < 6; i += 1) {
        rand += Math.random();
    }

    return rand / 6;
}