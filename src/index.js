import React from "react";
import ReactDOM from "react-dom";
import run from './queue';
import Chart from "./chart/chart";

class Marbles extends React.Component {

    constructor() {
        super();
        this.state = {
            lastArrival: 0,
            queue: [],
            processor: null,
            history: [],
            lastAverages: [],
        };
    }

    componentDidMount() {
        window.setInterval(() => {
            this.setState(run(this.state));
        }, 500);
    }

    render() {
        let totalLatency = 0;
        this.state.history.forEach(task => {
            totalLatency += task.startedAt - task.arrivedAt;
        });
        const averageLatency = this.state.lastAverages.length > 0 ? this.state.lastAverages[this.state.lastAverages.length - 1].value : 0;

        console.log("Average latency", averageLatency, "Queue length", this.state.queue.length);
        return <div>
            <Index averageLatency={averageLatency} queueLength={this.state.queue.length}/>
            <Chart points={this.state.lastAverages}/>
        </div>
    }
}

function Index({averageLatency, queueLength}) {
    return <div>
        <Meter label="Queue length" count={queueLength}/>
        <Meter label="Average latency" count={averageLatency}/>
    </div>;
}

function Meter({label, count}) {
    return <p>
        <span>{label}:</span> <span>{count}</span>
    </p>;
}

ReactDOM.render(<Marbles/>, document.getElementById("index"));
