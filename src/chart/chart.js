import React from "react";

import scale, {getScaledMaxValue} from './scale';
import {axisLabels} from './axis';

const WIDTH = 1000;
const HEIGHT = 400;
const MARGIN_LEFT = 50;
const MARGIN_TOP = 5;
const MARGIN_RIGHT = 25;
const MARGIN_BOTTOM = 25;

const LABEL_MARK_LENGTH = 5;


export default class Chart extends React.Component {
    constructor() {
        super();
        this.canvasRef = null;
        this.setCanvasRef = element => {
            this.canvasRef = element;
        };
    }

    render() {
        if (this.canvasRef !== null) {
            draw(this.canvasRef, this.props.points);
        }
        return <canvas ref={this.setCanvasRef} width={WIDTH} height={HEIGHT}/>
    }
}

function draw(canvas, points) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    const maxValue = getScaledMaxValue(points);
    const axisYLabels = axisLabels(0, maxValue, 5);

    drawYAxis(ctx, axisYLabels);
    scale(points, 50, maxValue).forEach(point => {
        drawPoint(ctx, point);
    });
}

function drawPoint(ctx, point) {
    ctx.beginPath();
    const x = positionToX(point.timestamp);
    const y = positionToY(point.value);
    const radius = 2; // Arc radius
    const startAngle = 0; // Starting point on circle
    const endAngle = 360;

    ctx.arc(x, y, radius, startAngle, endAngle, false);
    ctx.fill();
}

function drawYAxis(ctx, labels) {
    ctx.beginPath();
    ctx.moveTo(MARGIN_LEFT, MARGIN_TOP);
    ctx.lineTo(MARGIN_LEFT, HEIGHT - MARGIN_BOTTOM);
    ctx.closePath();
    ctx.stroke();

    labels.forEach(label => {
        ctx.beginPath();
        const y = positionToY(label.position);
        ctx.moveTo(MARGIN_LEFT - LABEL_MARK_LENGTH, y);
        ctx.lineTo(MARGIN_LEFT, y);
        ctx.closePath();
        ctx.stroke();
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(label.text, MARGIN_LEFT - LABEL_MARK_LENGTH - 1, y);
    });
}

function positionToX(position) {
    return WIDTH - MARGIN_RIGHT + position * (WIDTH - MARGIN_RIGHT - MARGIN_LEFT);
}

function positionToY(position) {
    return HEIGHT - (MARGIN_BOTTOM + position * (HEIGHT - MARGIN_BOTTOM - MARGIN_TOP));
}
