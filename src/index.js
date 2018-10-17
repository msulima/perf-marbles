import React from "react";
import ReactDOM from "react-dom";
import run from './queue';
import format from './format';
import stats from './stats';
import Chart from "./chart/chart";
import NumberInput from './input';
import ArrivalRatePicker from './distribution/ArrivalRatePicker';

import styles from './index.css';

console.log('wat', styles);

const MAX_HISTORY = 1000;
const MAX_STATS = MAX_HISTORY / 4;

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
            const deadline = this.state.iteration * 500;
            const queue = run(this.state.queue, this.state.arrival.generator, this.state.taskSize, deadline);

            const queueHistory = this.state.queueHistory.concat([queue]);
            const statsHistory = this.state.statsHistory.concat([stats(queueHistory.slice(-MAX_STATS), deadline)]);

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
        }, 50);
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

        return <div>
            <ArrivalRatePicker onChangeDistribution={this.handleChangeDistribution}/>
            <NumberInput label="Task size (ms)" value={this.state.taskSize}
                         onChange={value => this.setTaskSize(value)}/>
            <div>
                <Meter label="Expected arrival rate" count={format(this.state.arrival.arrivalRate) + " tasks/s"}/>
                <Meter label="Expected utilisation"
                       count={format((this.state.taskSize / 10) * this.state.arrival.arrivalRate, 100) + "%"}/>
            </div>
            <div className={styles['charts']}>
                <div className={styles['charts-chart']}>
                    <Chart title="Average latency" current={format(statsResult.averageLatency) + " ms"}
                           points={toChartSeries(this.state.statsHistory, (x) => x.averageLatency)}
                           maxHistory={MAX_HISTORY}/>
                </div>
                <div className={styles['charts-chart']}>
                    <Chart title="Average response" current={format(statsResult.averageResponse) + " ms"}
                           points={toChartSeries(this.state.statsHistory, (x) => x.averageResponse)}
                           maxHistory={MAX_HISTORY}/>
                </div>
                <div className={styles['charts-chart']}>
                    <Chart title="Utilisation" current={format(statsResult.utilisation * 100, 100) + "%"}
                           points={toChartSeries(this.state.statsHistory, (x) => x.utilisation)}
                           maxHistory={MAX_HISTORY}/>
                </div>
                <div className={styles['charts-chart']}>
                    <Chart title="Queue length" current={statsResult.queueLength}
                           points={toChartSeries(this.state.statsHistory, (x) => x.queueLength)}
                           maxHistory={MAX_HISTORY}/>
                </div>
                <div className={styles['charts-chart']}>
                    <Chart title="Arrival rate" current={format(statsResult.arrivalRate) + " tasks/s"}
                           points={toChartSeries(this.state.statsHistory, (x) => x.arrivalRate)}
                           maxHistory={MAX_HISTORY}/>
                </div>
            </div>
        </div>
    }
}

function Meter({label, count}) {
    return <p>
        <span>{label}:</span> <span>{count}</span>
    </p>;
}

function toChartSeries(history, getter) {
    const result = [];
    for (let i = 0; i < history.length; i++) {
        result.push({
            timestamp: i,
            value: getter(history[i]),
        });
    }
    return result;
}

ReactDOM.render(<Marbles/>, document.getElementById("index"));
