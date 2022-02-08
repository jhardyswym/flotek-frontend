import React from 'react';
import './components.css'
import DataManager from './DataManager';

export default class FlowGuage extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            flowRate:0,
            volume:0
        }
        this.GetInstantFlowRate = this.GetInstantFlowRate.bind(this);
        setInterval(this.GetInstantFlowRate,50);

    }

    GetInstantFlowRate()
    {
 
        const roundedFlow = Math.floor(DataManager.getInstance().getFlowData().avgFlow);
        this.setState({flowRate:roundedFlow});
                   
            
            
            
        
    }


    render()
    {
        return(
            <div className="guage">
            <div className= "guageTitle">Instantaneous Flow Rate</div>
            <div className = "flowBox">
                <div className="innerFlowBox">
                    <div className="divider"></div>
                    <div className="divider" style={{top:"-35%"}}>{this.state.flowRate}</div>
                </div>
                <div className="innerFlowBoxL">
                    <div className="divider"></div>
                    <div className="divider" style={{top:"-35%"}}>mL/min</div>
                </div>
                {/* Flow = {this.state.flowRate} */}
            </div>
            </div>
        )
    }
}