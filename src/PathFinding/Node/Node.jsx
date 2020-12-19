import React, { Component } from 'react';
import './Node.css';/*
import { DragSource, DropTarget } from 'react-dnd'

let dragable = false;

const itemSource = {
  beginDrag(props) {
    console.log("dragging");
    console.log(props);
    return props;
  },
  endDrag(props, monitor, Component) {
    if (!monitor.didDrop()) {
      //ADD FUNCTION
      return;
    }

    return props.handleDrop(props.item);
  }
}

function dragCollect(connect, monitor) {
  return { 
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }
}

function dropCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    hovered: monitor.isOver(),
    item: monitor.getItem(),
  }
}

class Node extends Component {
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
      isFinish ? 'node-finish'
    : isStart ? 'node-start'
    : isWall ? 'node-wall'
    : '';

    if(isStart || isFinish){
      dragable = true;
      const {
        isDragging,
        connectDragSource,
      } = this.props;

      const opacity = isDragging ? 0 : 1;

      return connectDragSource(
        <div id={`node-${row}-${col}`}
          className={`node ${extraClassName}`}
          style={{ opacity }}
          onMouseDown={() => onMouseDown(row, col)}
          onMouseEnter={() => onMouseEnter(row, col)}
          onMouseUp={() => onMouseUp()}></div>
      );
    } else {
      const {
        hovered,
        connectDropTarget,
      } = this.props;

      const backgroundColor = hovered ? 'lightgreen' : 'white';
      
      return connectDropTarget(
        <div id={`node-${row}-${col}`}
          className={`node ${extraClassName}`}
          style={{ backgroundColor }}
          onMouseDown={() => onMouseDown(row, col)}
          onMouseEnter={() => onMouseEnter(row, col)}
          onMouseUp={() => onMouseUp()}></div>
      );
    }

  }
}

const x = DropTarget("item", {}, dropCollect)(Node);
export default DragSource("item", itemSource, dragCollect)(x);

*/

//BEFORE DRAG AND DROP
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
      isFinish ? 'node-finish'
    : isStart ? 'node-start'
    : isWall ? 'node-wall'
    : '';

    return (
      <div id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}></div>
    );

  }
}