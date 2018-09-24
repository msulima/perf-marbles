import React from "react";

import scale from './scale';

const WIDTH = 1000;
const HEIGHT = 500;
const MARGIN_LEFT = 25;
const MARGIN_TOP = 5;
const MARGIN_RIGHT = 25;
const MARGIN_BOTTOM = 25;


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

    scale(points, 50).forEach(point => {
        drawPoint(ctx, point);
    });
}

function drawPoint(ctx, point) {
    ctx.beginPath();
    const x = timeToX(point);
    const y = valueToY(point);
    const radius = 2; // Arc radius
    const startAngle = 0; // Starting point on circle
    const endAngle = 360;

    ctx.arc(x, y, radius, startAngle, endAngle, false);
    ctx.fill();
}

function timeToX({timestamp}) {
    return WIDTH - MARGIN_RIGHT + timestamp * (WIDTH - MARGIN_RIGHT - MARGIN_LEFT);
}

function valueToY({value}) {
    return HEIGHT - (MARGIN_BOTTOM + value * (HEIGHT - MARGIN_BOTTOM - MARGIN_TOP));
}
