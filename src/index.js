import React from "react";
import ReactDOM from "react-dom";
import run from './queue';
import Chart from "./chart/chart";
import NumberInput from './input';

class Marbles extends React.Component {

    constructor() {
        super();
        this.state = {
            interval: 500,
            taskSize: 100,
            queue: {
                lastArrival: 0,
                queue: [],
                processor: null,
                history: [],
                lastAverages: [],
            },
        };
    }

    componentDidMount() {
        window.setInterval(() => {
            this.setState({
                queue: run(this.state.queue, this.state.interval, this.state.taskSize),
            });
        }, 500);
    }

    setTaskSize(taskSize) {
        this.setState({taskSize});
    }

    setInterval(interval) {
        this.setState({interval});
    }

    render() {
        const lastAverages = this.state.queue.lastAverages;
        const averageLatency = lastAverages.length > 0 ? lastAverages[lastAverages.length - 1].value : 0;
        const queueLength = this.state.queue.queue.length;

        console.log("Average latency", averageLatency, "Queue length", queueLength);
        return <div>
            <NumberInput label="Interval" value={this.state.interval} onChange={value => this.setInterval(value)}/>
            <NumberInput label="Task size" value={this.state.taskSize} onChange={value => this.setTaskSize(value)}/>
            <Index averageLatency={averageLatency} queueLength={queueLength}/>
            <Chart points={lastAverages}/>
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
