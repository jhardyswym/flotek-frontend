import React from 'react';
import './components.css'
import OffsetPopvol from './offsetPopVol'

export default class OffsetButtonVol extends React.Component
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
                {this.state.seen ? <OffsetPopvol flipped={this.props.flipped} toggle={this.togglePop} /> : null}
            </div>
        );
    }

    
}