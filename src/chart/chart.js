import React from "react";

import scale, {getScaledMaxValue} from './scale';
import {axisLabels} from './axis';

const WIDTH = 1000;
const HEIGHT = 400;
const MARGIN_LEFT = 25;
const MARGIN_TOP = 10;
const MARGIN_RIGHT = 50;
const MARGIN_BOTTOM = 25;

const LABEL_MARK_LENGTH = 5;


export default class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = null;
        this.maxHistory = props.maxHistory;
        this.setCanvasRef = element => {
            this.canvasRef = element;
        };
    }

    render() {
        let width = MARGIN_LEFT + MARGIN_RIGHT;
        if (this.canvasRef !== null) {
            width = Math.floor(Math.max(width, this.canvasRef.parentElement.getBoundingClientRect().width));
            draw(this.canvasRef, width, this.props.points, this.props.maxHistory);
        }
        return <div>
            <h2>{this.props.title}: {this.props.current}</h2>
            <canvas ref={this.setCanvasRef} width={width} height={HEIGHT}/>
        </div>
    }
}

function draw(canvas, width, points, maxHistory) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, HEIGHT);

    const maxValue = getScaledMaxValue(points);
    const axisYLabels = axisLabels(0, maxValue, 5);

    drawXAxis(ctx, width);
    drawYAxis(ctx, width, axisYLabels);
    const scaled = scale(points, maxHistory, maxValue);
    drawSeries(ctx, width, scaled);
}

function drawXAxis(ctx, width) {
    ctx.beginPath();
    ctx.moveTo(MARGIN_LEFT, HEIGHT - MARGIN_BOTTOM);
    ctx.lineTo(width - MARGIN_RIGHT, HEIGHT - MARGIN_BOTTOM);
    ctx.stroke();
}

function drawYAxis(ctx, width, labels) {
    ctx.beginPath();
    const positionX = width - MARGIN_RIGHT;
    ctx.moveTo(positionX, MARGIN_TOP);
    ctx.lineTo(positionX, HEIGHT - MARGIN_BOTTOM);
    ctx.stroke();

    labels.forEach(label => {
        const y = positionToY(label.position);
        ctx.moveTo(positionX + LABEL_MARK_LENGTH, y);
        ctx.lineTo(positionX, y);
        ctx.stroke();
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(label.text, positionX + LABEL_MARK_LENGTH + 1, y);
    });
}

function drawSeries(ctx, width, points) {
    ctx.beginPath();
    points.forEach((point, i) => {
        const x = positionToX(width, point.timestamp);
        const y = positionToY(point.value);

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
}

function positionToX(width, position) {
    return width - MARGIN_RIGHT + position * (width - MARGIN_RIGHT - MARGIN_LEFT);
}

function positionToY(position) {
    return HEIGHT - (MARGIN_BOTTOM + position * (HEIGHT - MARGIN_BOTTOM - MARGIN_TOP));
}
