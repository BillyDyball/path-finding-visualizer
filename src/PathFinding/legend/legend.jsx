import React from 'react'

export default class Legend extends React.Component {
    render() {
        return (
            <>
            <div className="col bg-danger">
                <div className="container">
                    <div className="row">
                        <div className="title mx-auto text-center">Key</div>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            Node
                        </div>
                        <div className="col-4">
                            Wall
                        </div> 
                        <div className="col-4">
                            Shortestpath
                        </div>
                    </div>
                </div>
            </div>
            </>
        );
    }
}