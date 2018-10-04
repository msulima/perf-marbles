import React from "react";
import ReactDOM from "react-dom";
import run from './queue';
import format from './format';
import stats from './stats';
import Chart from "./chart/chart";
import NumberInput from './input';
import ArrivalRatePicker from './distribution/ArrivalRatePicker';

const MAX_HISTORY = 200;

class Marbles extends React.Component {

    constructor() {
        super();
        this.state = {
            iteration: 0,
            arrival: ArrivalRatePicker.getInitialState(),
            taskSize: 100,
            queue: {
                lastArrival: 0,
                queue: [],
                processor: null,
            },
            queueHistory: [],
            statsHistory: [stats([])],
        };
        this.handleChangeDistribution = this.handleChangeDistribution.bind(this);
    }

    componentDidMount() {
        window.setInterval(() => {
            const deadline = this.state.iteration * 200;
            const queue = run(this.state.queue, this.state.arrival.generator, this.state.taskSize, deadline);

            const queueHistory = this.state.queueHistory.concat([queue]);
            const statsHistory = this.state.statsHistory.concat([stats(queueHistory, deadline)]);

            if (queueHistory.length > MAX_HISTORY) {
                queueHistory.shift();
                statsHistory.shift();
            }

            this.setState({
                iteration: this.state.iteration + 1,
                queue,
                queueHistory,
                statsHistory,
            });
        }, 200);
    }

    setTaskSize(taskSize) {
        this.setState({taskSize});
    }

    setInterval(interval) {
        this.setState({interval});
    }

    handleChangeDistribution(distribution) {
        this.setState({
            arrival: distribution,
        });
    }

    render() {
        const statsResult = this.state.statsHistory[this.state.statsHistory.length - 1];
        console.log(statsResult);

        const lastAverages = [];
        for (let i = 0; i < this.state.statsHistory.length; i++) {
            lastAverages.push({
                timestamp: i,
                value: this.state.statsHistory[i].averageLatency,
            });
        }

        const lastUtilisations = [];
        for (let i = 0; i < this.state.statsHistory.length; i++) {
            lastUtilisations.push({
                timestamp: i,
                value: this.state.statsHistory[i].utilisation,
            });
        }

        return <div>
            <ArrivalRatePicker onChangeDistribution={this.handleChangeDistribution}/>
            <NumberInput label="Task size (ms)" value={this.state.taskSize}
                         onChange={value => this.setTaskSize(value)}/>
            <div>
                <Meter label="Arrival rate" count={format(this.state.arrival.arrivalRate)}/>
                <Meter label="Queue length" count={statsResult.queueLength}/>
                <Meter label="Average latency" count={format(statsResult.averageLatency)}/>
                <Meter label="Expected utilisation"
                       count={format((this.state.taskSize / 1000) * this.state.arrival.arrivalRate, 0.1)}/>
                <Meter label="Utilisation" count={format(statsResult.utilisation, 0.1)}/>
            </div>
            <Chart points={lastAverages} maxHistory={MAX_HISTORY}/>
            <Chart points={lastUtilisations} maxHistory={MAX_HISTORY}/>
        </div>
    }
}

function Meter({label, count}) {
    return <p>
        <span>{label}:</span> <span>{count}</span>
    </p>;
}

ReactDOM.render(<Marbles/>, document.getElementById("index"));
