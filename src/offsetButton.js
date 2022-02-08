import React from 'react';
import './components.css'
import CalibrationPop from './calibrationPop';

export default class OffsetButton extends React.Component
{
    state = {
        seen:false
    };

    togglePop = () =>{
        this.setState({seen: !this.state.seen});
    };

    render()
    {
        return(
            <div>
                <button className="hiddenButton" style={{marginleft:"10%"}} onClick={this.togglePop}>Calibrate</button>
                {this.state.seen ? <CalibrationPop toggle={this.togglePop} /> : null}
            </div>
        );
    }

    
}