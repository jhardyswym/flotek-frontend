import React from 'react';
import './components.css'

export default class VolumeGuage extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            flowRate:0,
            volume:0
        }
        this.GetVolume = this.GetVolume.bind(this);
        setInterval(this.GetVolume,300);

    }

    GetVolume()
    {
        fetch("http://localhost:3005/peakAvg")
        .then(res => res.json())
        .then(
            (result) =>{
                
                const peakAvg = Math.floor(result.volume);
                this.setState({volume:peakAvg});
                ////console.log(peakAvg);
               
            },

            (error)=> {
                
                this.setState({flowRate:0});
            }
        )
    }

    render()
    {
        return(
            <div className="volguage">
            <div className= "guageTitle">Volume</div>
            <div className = "flowBox">
                <div className="innervFlowBox" >
                    <div className="divider"></div>
                    <div className="divider" style={{top:"-35%"}}>{this.state.volume}</div>
                </div>
                <div className="innervFlowBoxL">
                    <div className="divider"></div>
                    <div className="divider" style={{top:"-35%"}}>mL</div>
                </div>
                {/* Flow = {this.state.flowRate} */}
            </div>
            </div>
        )
    }
}