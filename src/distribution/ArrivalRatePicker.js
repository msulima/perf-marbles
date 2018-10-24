import React from "react";
import DistributionPicker from "./DistributionPicker";
import NumberInput from '../input';
import ParametersPicker from "./ParametersPicker";
import format from '../format';

export default class ArrivalRatePicker extends React.Component {

    static getInitialState() {
        return mapToState(ArrivalRatePicker.getInitial());
    }

    static getInitial() {
        return {
            distribution: "uniform",
            mean: 200,
            beta: 150,
            taskSize: 100,
        };
    }

    constructor(props) {
        super(props);
        this.state = ArrivalRatePicker.getInitial();
        this.handleChangeDistribution = this.handleChangeDistribution.bind(this);
        this.handleChangeMean = this.handleChangeMean.bind(this);
        this.handleChangeBeta = this.handleChangeBeta.bind(this);
        this.handleChangeTaskSize = this.handleChangeTaskSize.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleChangeTaskSize(taskSize) {
        this.setState({taskSize});
    }

    handleSubmit(ev) {
        this.props.onChangeDistribution(mapToState(this.state));
        ev.preventDefault();
    }

    render() {
        const arrivalRate = 1000 / this.state.mean;
        return <form onSubmit={this.handleSubmit}>
            <fieldset>
                <DistributionPicker checked={this.state.distribution} onChange={this.handleChangeDistribution}/>
                <ParametersPicker mean={this.state.mean} beta={this.state.beta}
                                  betaEnabled={this.state.distribution === 'uniform'}
                                  onChangeMean={this.handleChangeMean} onChangeBeta={this.handleChangeBeta}/>
                <NumberInput label="Task size (ms)" value={this.state.taskSize} onChange={this.handleChangeTaskSize}/>
                <div>
                    <Meter label="Expected arrival rate" count={format(arrivalRate) + " tasks/s"}/>
                    <Meter label="Expected utilisation"
                           count={format((this.state.taskSize / 10) * arrivalRate, 100) + "%"}/>
                </div>
                <button>Apply</button>
            </fieldset>
        </form>;
    }
}

function Meter({label, count}) {
    return <p>
        <span>{label}:</span> <span>{count}</span>
    </p>;
}

function mapToState(state) {
    return {
        generator: distribution(state.distribution).bind(null, state.mean, state.beta),
        arrivalRate: 1000 / state.mean,
        taskSize: state.taskSize,
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
