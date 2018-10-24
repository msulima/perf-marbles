import React from "react";
import ReactDOM from "react-dom";
import run from './queue';
import format from './format';
import stats from './stats';
import Chart from "./chart/chart";
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

    handleChangeDistribution(distribution) {
        this.setState({
            arrival: distribution,
            taskSize: distribution.taskSize,
        });
    }

    render() {
        const statsResult = this.state.statsHistory[this.state.statsHistory.length - 1];
        console.log(statsResult);

        return <div>
            <ArrivalRatePicker onChangeDistribution={this.handleChangeDistribution}/>
            <div className={styles['charts']}>
                <div className={styles['charts-chart']}>
                    <Chart title="Utilisation" current={format(statsResult.utilisation * 100, 100) + "%"}
                           points={[this.state.statsHistory.map((x) => x.utilisation)]}
                           maxHistory={MAX_HISTORY}/>
                </div>
                <div className={styles['charts-chart']}>
                    <Chart title="Average latency" current={format(statsResult.averageLatency) + " ms"}
                           points={[this.state.statsHistory.map((x) => x.averageLatency)]}
                           maxHistory={MAX_HISTORY}/>
                </div>
                <div className={styles['charts-chart']}>
                    <Chart title="Arrival rate" current={format(statsResult.arrivalRate) + " tasks/s"}
                           points={[this.state.statsHistory.map((x) => x.arrivalRate)]}
                           maxHistory={MAX_HISTORY}/>
                </div>
                <div className={styles['charts-chart']}>
                    <Chart title="Queue length" current={statsResult.queueLength}
                           points={[this.state.statsHistory.map((x) => x.queueLength)]}
                           maxHistory={MAX_HISTORY}/>
                </div>
                <div className={styles['charts-chart']}>
                    <Chart title="Average response" current={format(statsResult.averageResponse) + " ms"}
                           points={[this.state.statsHistory.map((x) => x.averageResponse)]}
                           maxHistory={MAX_HISTORY}/>
                </div>
                <div className={styles['charts-chart']}>
                    <Chart title="Percentiles"
                           current={"p50:" + format(statsResult.p50) + " p75:" + format(statsResult.p75) + " p95:" + format(statsResult.p95) + " p99:" + format(statsResult.p99)}
                           points={[
                               this.state.statsHistory.map((x) => x.p99),
                               this.state.statsHistory.map((x) => x.p95),
                               this.state.statsHistory.map((x) => x.p75),
                               this.state.statsHistory.map((x) => x.p50),
                           ]}
                           maxHistory={MAX_HISTORY}/>
                </div>
            </div>
        </div>
    }
}

ReactDOM.render(<Marbles/>, document.getElementById("index"));
