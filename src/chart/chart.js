import React from "react";

import scale, {getScaledMaxValue} from './scale';
import {axisLabels} from './axis';

const HEIGHT = 400;
const MARGIN_LEFT = 25;
const MARGIN_TOP = 10;
const MARGIN_RIGHT = 50;
const MARGIN_BOTTOM = 25;

const LABEL_MARK_LENGTH = 5;

const COLOURS = [
    "#0a437c",
    "#0a50a1",
    "#5195ce",
    "#70dbed",
];

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

function draw(canvas, width, series, maxHistory) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, HEIGHT);

    const maxValue = getScaledMaxValue(series);
    const axisYLabels = axisLabels(0, maxValue, 5);

    drawXAxis(ctx, width);
    drawYAxis(ctx, width, axisYLabels);
    const scaled = scale(series, maxValue);
    scaled.forEach((points, i) => {
        drawSeries(ctx, width, maxHistory, points, COLOURS[i] || "#000000");
    });
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

function drawSeries(ctx, width, maxHistory, points, colour) {
    const leftFill = maxHistory - points.length;
    const style = ctx.strokeStyle;
    ctx.strokeStyle = colour;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    points.forEach((point, i) => {
        const x = positionToX(width, (i + leftFill) / maxHistory);
        const y = positionToY(point);

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    ctx.strokeStyle = style;
}

function positionToX(width, position) {
    return MARGIN_LEFT + position * (width - MARGIN_RIGHT - MARGIN_LEFT);
}

function positionToY(position) {
    return HEIGHT - (MARGIN_BOTTOM + position * (HEIGHT - MARGIN_BOTTOM - MARGIN_TOP));
}
