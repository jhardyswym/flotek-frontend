import React from 'react'
//import './pidModule.css'
import './settingsmod.css'
import KeyPadInput from './keypadInput';

export default class PidPopup extends React.Component
{

    constructor(props,)
    {
        super(props);
        this.state = {
            kProp:this.props.kp,
            kInt:this.props.ki,
            kDer:this.props.kd,
            volLim:this.props.volLim,
        }
    }

    OnKpChange = (value) =>{
        this.setState({kProp:value})
    };

    OnKiChange = (value) =>{
        this.setState({kInt:value})
    };

    OnKdChange = (value) =>{
        this.setState({kDer:value})
    };

    OnVLChange = (value) =>{
        this.setState({volLim:value})
    };
    
    SaveValues = () =>{
        this.props.onSet(this.state.kProp,this.state.kInt,this.state.kDer,this.state.volLim)
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
            
                gProp:this.state.kProp,
                gInt:this.state.kInt,
                gDer:this.state.kDer,
                volLim:this.state.volLim
            })
        }

        fetch("http://localhost:3005/pid",requestOptions)
        .then(res => res.json())
        .then(
            (result) =>{
                
                
            },

            (error)=> {
             
            }
        )
        
        this.props.toggle();
        
    }

    CloseWindow = () => {
        this.props.toggle();
    }
    render()
    {
        return(

            <div className="modal" >
                <div className="modal_content">
                    <div className="modalTopBar">
                        <div className="modalTitle"><div className="titletext">PID Control Settings</div></div>
                        <div className="exitButton" onClick={this.CloseWindow}><div style={{display:"table-cell",verticalAlign:"middle",fontSize:"30px",fontWeight:"bold"}}>&times;</div></div>
                    </div>
                    <div className="keyBucket">
                        <div className="keyOrg">
                            <div className="kTableCell">
                                
                                <div className="entitle"><div className="entxt">Proportional Gain:</div></div>
                                <div className = "entry">
                               
                                <KeyPadInput initVal={this.state.kProp} className="entry" onChange={this.OnKpChange}/>
                                </div>
                               
                            </div>
                            <div className="kTableCell">
                                <div className="entitle"><div className="entxt">Integral Gain:</div></div>
                                <div className = "entry">
                                
                                <KeyPadInput initVal={this.state.kInt} className="entry" onChange={this.OnKiChange}/>
                                </div>
                            </div>
                            <div className="kTableCell">
                                <div className="entitle"><div className="entxt">Derivative Gain:</div></div>
                                <div className = "entry">
                                <KeyPadInput initVal={this.state.kDer} className="entry" onChange={this.OnKdChange}/>
                                
                                </div>
                            </div>
                            <div className="kTableCell">
                                <div className="entitle"><div className="entxt">Volume Control Flow Limit [mL/min]:</div></div>
                                <div className = "entry">
        
                                <KeyPadInput initVal={this.state.volLim} className="entry" onChange={this.OnVLChange}/>
                                
                                </div>
                            </div>
                        </div>
                        <div className="buttonDiv">
                            <button className = "saveButton" onClick ={this.SaveValues}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}