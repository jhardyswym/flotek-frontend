import React from 'react';

import './offsetPop.css'
import KeyPadInput from './keypadInput';
class OffsetInput extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            currentVal:0,
            wantedVal: 0,
            offset: 0,
        };

      
    }

    OnCurrentChange = (value) =>{
        this.setState({currentVal:value})
        ////console.log(this.state.currentVal)
    };

    OnWantedChange = (value) =>{
        this.setState({wantedVal:value})
       // //console.log(this.state.wantedVal)
    };

    componentDidMount = () =>{
        if(this.props.osType === '0'){
        this.GetInstantFlowRate();
        }else{
            this.getVolSetPoint();
        }
     
    }

    SetOffset = () =>{
        
        var os = this.state.wantedVal - this.state.currentVal;
        if(this.props.osType === '1'){
            if(this.state.currentVal === 0){
                return;
            }
            else{
            os = this.state.currentVal / this.state.wantedVal;
            }
        }
        this.setState({offset:os})
        //console.log(this.state.offset)

        const requestOptions = {
            method: 'POST',
    
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({offsetValue: os,type: this.props.osType})
        }
        //(requestOptions.body)
        fetch("http://localhost:3005/offset",requestOptions)
        .then(res => res.json())
        .then(
            (result) =>{
                
                
            },

            (error)=> {
             
            }
        )
        
        this.props.closeFunc()
    };
    ClearOffset = () =>{
        
        const requestOptions = {
            method: 'POST',
    
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({offsetValue: 0,type: this.props.osType})
        }
        //(requestOptions.body)
        fetch("http://localhost:3005/offset",requestOptions)
        .then(res => res.json())
        .then(
            (result) =>{
                
                
            },

            (error)=> {
             
            }
        )
        
        this.props.closeFunc()
    };
    GetInstantFlowRate = () =>
    {
        
        fetch("http://localhost:3005/flow")
            .then(res => res.json())
            .then(
                (result) =>{
                    
                    const roundedFlow = Math.floor(result.iFlowRate);
                    //console.log(roundedFlow)
                    this.setState({currentVal:roundedFlow});
                   
                },

                (error)=> {
                    
                    this.setState({flowRate:0});
                }
            )
            
            
        
    }
    getVolSetPoint = () =>
    {
        
        fetch("http://localhost:3005/getVolSp")
            .then(res => res.json())
            .then(
                (result) =>{
                    ////console.log(result.iflowRate)
                    
                    this.setState({currentVal:result.volume});
                   
                },

                (error)=> {
                    
                    this.setState({flowRate:0});
                }
            )
            
            
        
    }

    render(){
       return(
           <div style={{height:"80%",width:"100%"}}>
                        <div className="keyOrg">
                            <div className="kTableCell"> 
                                <div className="entitle"><div className="entxt" style={{color:"blue"}}>FDC Read Value:</div></div>
                                <div className = "entry">
                               
                                <KeyPadInput overrideval={this.state.currentVal} className="entryIn"onChange={this.OnCurrentChange}/>
                                </div>
                               
                            </div>
                            <div className="kTableCell">
                                <div className="entitle"><div className="entxt" style={{color:"red"}}>Ext. Measured Value:</div></div>
                                <div className = "entry">
                               
                                <KeyPadInput initVal={this.state.wantedVal} className="entryIn" onChange={this.OnWantedChange}/>
                                </div>
                            </div>
                            
                        </div>
           <div className="buttonDivv">
            <button className="saveButtonv" onClick ={this.SetOffset}>Calibrate</button>
            <button className="saveButtonv" style={{left:"70%",position:"absolute"}} onClick ={this.ClearOffset}>Reset</button>
           </div>
           </div>
       );
    }
}

export default OffsetInput;