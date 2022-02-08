import React from 'react'
import './components.css'
import './pidselector.css'
import { Button } from 'semantic-ui-react'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PidButton from './pidButton';
import KeyPadInput from './keypadInput'
import SecondaryDataManager from './secondaryDataManager'
import DataManager from './DataManager'
const color_blue = '#54D3FF';
const color_green = '#47C970'
export default class PidSelector extends React.Component
{
    //Control States:
    // 0: Flow
    // 1: Volume
    
    constructor(props)
    {
      super(props);
      this.state = 
      {
        controlState:0,
        flowset:0,
        volset: 0,
        settingsOpen:false,
        bColor: color_blue,
        vunit: "mL",
        volumeOnSecondary: false
      }
  
    }
    SetControlState = (state) => {
        this.setState({controlState:state});
        this.props.OnStateChange(state);
        this.setState({bColor:color_blue});
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                mode:state
         
            })

            
        }

        fetch("http://localhost:3005/controlmode",requestOptions)
        .then(res => res.json())
        .then(
            (result) =>{
                
                
            },

            (error)=> {
             
            }
        )
    }
    

    OnSetPointChange = (value) => {
        this.setState({bColor:color_blue});
        this.setState({flowset:value});
        //console.log(this.state.flowset)
    }

    SetSetpoint = () => {
        //console.log('click')
        this.setState({bColor:color_green});
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                setPoint:this.state.flowset,
         
            })
        }

        fetch("http://localhost:3005/flowsetpoint",requestOptions)
        .then(res => res.json())
        .then(
            (result) =>{
                
                
            },

            (error)=> {
             
            }
        )
        

    }

    SetVolume = () => {
        this.setState({bColor:color_green});
        //console.log(this.state.volset)
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                volDisp:this.state.volset,
                volumetric:this.state.volumeOnSecondary
            })
        }

        fetch("http://localhost:3005/voldisp",requestOptions)
        .then(res => res.json())
        .then(
            (result) =>{
                
                
            },

            (error)=> {
             
            }
        )
    }

    

    GetSetPoint = () => {
        //console.log("getttt")
        fetch("http://localhost:3007/getsetpt")
        .then(res => res.json())
        .then(
            (result) =>{
                //console.log(result)
                const setpt = result[0].last;
                this.setState({flowset:setpt});
                ////console.log(peakAvg);
               
            },

            (error)=> {
                
            
            }
        )
    }

    GetVolPoint = () => {
        fetch("http://localhost:3007/getvolpt")
        .then(res => res.json())
        .then(
            (result) =>{
                //console.log(result)
                const setpt = result[0].last;
                this.setState({volset:setpt});
                ////console.log(peakAvg);
               
            },

            (error)=> {
                
            
            }
        )
    }

    OnVolSetPointChange = (set) =>{

        this.setState({volset:set});
        this.setState({bColor:color_blue});
    }

    OpenSettings = () =>{
        this.setState({settingsOpen:true});
    }

    componentDidMount = () =>{
        this.GetSetPoint();
        this.SetControlState(0);

        
        setInterval(this.GetUnit,150);
    }
    GetUnit = () =>{
        var _dat = DataManager.getInstance().getVolumetricData();
        //console.log(_dat)
        var unit = _dat.unit;
        var vol_secondary = false;
        if(unit != "null")
        {
            vol_secondary = true;
        }
        this.setState({vunit:unit,volumeOnSecondary:vol_secondary});
    }
    render(){
        //console.log(this.state.bColor)
        return(
            
        <div className="pidSection">
            <div className="innerPidSection">
                
                {this.state.controlState === 0 &&
                <div className="buttonHDiv">
                    <div className="modeDiv">
                <Button.Group className="buttonGroup">
                    <Button className="selButtonFh">Flow</Button>
                    <Button className="selButtonV" onClick={() => {this.SetControlState(1)}}>Volume</Button>
                </Button.Group>
                </div>

                
                <PidButton icon = {<FontAwesomeIcon icon = {faCog} size="2x" color="white"></FontAwesomeIcon>}></PidButton>
                </div>
            
                }
                {this.state.controlState === 1 &&
                <div className="buttonHDiv">
                    <div className="modeDiv">
                <Button.Group className="buttonGroup">
                    <Button className="selButtonF" onClick={() => {this.SetControlState(0)}}>Flow</Button>
                    <Button className="selButtonVh">Volume</Button>
                </Button.Group>
                </div>
                <PidButton icon = {<FontAwesomeIcon icon = {faCog} size="2x" color="white"></FontAwesomeIcon>}></PidButton>
                </div>
                }
                <div className="lowerPidSection">
                    {this.state.controlState === 0 &&
                        <div className = "fieldCont">
                            <div className = "spField">
                                <span style={{color:"white",fontSize:"12px"}}>Flow Setpoint [mL/min]</span>
                               
                                <KeyPadInput initVal={this.state.flowset}onChange={this.OnSetPointChange}/>
                                <button className = "spButton" onClick = {this.SetSetpoint} style={{backgroundColor:this.state.bColor}}>Set</button>
                            </div>
                        </div>
                    }
                    {this.state.controlState === 1 &&
                        <div className = "fieldCont">
                            <div className = "spField">
                                <span style={{color:"white",fontSize:"12px"}}>Volume Setpoint [{this.state.vunit}]</span>
                            
                                <KeyPadInput initVal={this.state.volset} onChange={this.OnVolSetPointChange}/>
                                <button className = "spButton" onClick = {this.SetVolume} style={{backgroundColor:this.state.bColor}}>Set</button>
                            </div>
                        </div>
                    }
                </div>

            </div>

        </div>)
    }


}