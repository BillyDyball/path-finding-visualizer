import React, { Component } from 'react';
import './Node.scss';

export default class Node extends Component {
    render() {
        const {
            row,
            col,
            isFinish,
            isStart,
            isWall,
            onMouseDown,
            onMouseEnter,
            onMouseUp,
        } = this.props; //Props are being passed over
        const extraClassName =
            isFinish ? 'node-finish' :
            isStart ? 'node-start' :
            isWall ? 'node-wall' : '';

        return (
            <button id={`node-${row}-${col}`}
                className={`node ${extraClassName}`}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
                onMouseUp={() => onMouseUp()}></button>
        );

    }
}