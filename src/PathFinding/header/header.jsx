import React from 'react'
import { Navbar, Nav, Button, Form } from 'react-bootstrap'

export default class Header extends React.Component {
    render() {
        const { disableBtn } = this.props;
        return (
            <Navbar collapseOnSelect expand="lg" bg="dark-purple">
                <Navbar.Brand href="#home">Billy Dyball</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="navbar-collapse d-flex flex-md-row">
                        <Form.Control as="select" 
                            id="mazeAlgorithmSelect" 
                            disabled={disableBtn}
                            onChange={() => this.props.selectMazeAlgorithm()}
                            className="p-0 mr-2 my-1"
                            style={{width: "unset"}}>
                            <option value="" disabled defaultValue>Maze Algorithms</option>
                            <option>Recursive Maze Division</option>
                            <option>Backtracking</option>
                            <option>Kruskal</option>
                        </Form.Control>

                        <Form.Control as="select" 
                            id="algorithmSelect" 
                            disabled={disableBtn}
                            className="p-0 my-1"
                            style={{width: "unset"}} >
                            <option value="" disabled defaultValue>Search Algorithms</option>
                            <option>A*</option>
                            <option>Breadth-First-Search</option>
                            <option>Best-First-Search</option>
                            <option>Depth-First-Search</option>
                            <option>Dijkstra</option>
                        </Form.Control>

                        <Button variant="outline-custom"
                            onClick={() => this.props.selectAlgorithm()} 
                            id="btnSort"
                            disabled={disableBtn}
                            className="my-1">Search</Button>
                        <Button variant="outline-custom"
                            onClick={() => this.props.clearGrid()} 
                            disabled={disableBtn}
                            className="my-1">Clear Board</Button>6
                        <Button variant="outline-custom"
                            onClick={() => this.props.clearVisitedNodes()} 
                            disabled={disableBtn}
                            className="my-1">clear Visited Nodes</Button>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}