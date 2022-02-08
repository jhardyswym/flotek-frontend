import React from 'react'
import './components.css'
import './secondaryPanel.css'
import { Button } from 'semantic-ui-react'
import { faCog, faRulerCombined } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PidButton from './pidButton';
import SecondaryPop from './secondaryPop'
import SecondaryDataManager from './secondaryDataManager'
import { VolumetricSelections } from './secondaries'
import KeyPadInput from './keypadInput'
import DataManager from './DataManager'
const color_blue = '#54D3FF';
const color_green = '#47C970'

function toHex(c)
{
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function gethtmlfromrgb(r,g,b)
{
    return '#' + toHex(Math.round(r)) + toHex(Math.round(g)) + toHex(Math.round(b));
}
function genGreenToReds()
{
    var red = 0;
    var green = 255;
    var buf = []
    const stepSize = 255/49.5;

    while(red < 255)
    {
        red += stepSize;
        if(red > 255) red = 255;
        buf.push(gethtmlfromrgb(red,green,0));
    }
    while(green > 0){
        green -= stepSize;
        if(green < 0) green = 0;
        buf.push(gethtmlfromrgb(red,green,0));
    }

    return buf;

}

const greenredGradient = genGreenToReds();
function getGreenToRedColorFromPct(pct)
{
    if(pct > 99) pct = 99;
    var _ipct = 99 - pct
    return greenredGradient[Math.round(_ipct)]
}

const status_ready = <text style={{fontWeight:'bold',color:'limegreen',float:'right'}}>CONNECTED</text>;
const status_nready = <text style={{fontWeight:'bold',color:'red',float:'right'}}>DISCONNECTED</text>
export default class VolumetricPanel extends React.Component
{

    constructor(props)
    {
      super(props);
      this.state = {
          measurementType : VolumetricSelections[0],
          measurementUnit : "",
          measurementLimit : 0,
          measLimBuf:0,
          measurementChannel: 0,
          currentReading : 0,
          guageColor:getGreenToRedColorFromPct(0),
          seen : false,
          statusUI:status_ready,
          measLimInput:0
      }
    }

    openSetup = () =>{
        const seen = this.state.seen;
        this.setState({seen:!seen});
    }

    loadDefault = () =>{
        SecondaryDataManager.getInstance().setVolParams(VolumetricSelections[1],"g",1,15);
        SecondaryDataManager.getInstance().sendVolBackendUpdate();
        var params = SecondaryDataManager.getInstance().getVolParams();
        this.setState({
            measurementType: params.sensorType,
            measurementUnit: params.unit,
            measurementLimit:params.limit,
            measurementChannel:params.channel
        });
    }
    onParamsChanged = ()=>{

        const dataManager = SecondaryDataManager.getInstance();
        const params = dataManager.getVolParams();
        //console.log(params);
        this.setState({
            measurementType: params.sensorType,
            measurementUnit: params.unit,
            measurementLimit:params.limit,
            measurementChannel:params.channel
        });

        dataManager.sendVolBackendUpdate();
    }
    updateReading = () =>{
        if(this.state.seen) return;

        const dataManager = DataManager.getInstance();
        const _voldata = dataManager.getVolumetricData();
        this.setState({currentReading:_voldata.reading.toFixed(2),measurementLimit:_voldata.setpoint,measurementUnit:_voldata.unit});
        this.sensorAvailable(_voldata.available);
        var rd = (this.state.currentReading * 100)/this.state.measurementLimit;

        if(rd > 99) rd = 99;
        //console.log(rd);
        this.setState({guageColor:getGreenToRedColorFromPct(rd)});

    }
    sensorAvailable = (avail) =>{
        
        if( avail )
        {
            this.setState({statusUI:status_ready});
        }else{
            this.setState({statusUI:status_nready})
        }
    }
    componentDidMount = () =>{
       // this.loadDefault();
        this.sensorAvailable(false);
        
        DataManager.getInstance().OnPoll(this.updateReading);

    }
    onLimchange = (newVal) =>{
        
        if(isNaN(newVal)){
            //console.log("neval nan")
            newVal = 0.0;
        }
       // console.log(newVal)
        this.setState({measLimInput:newVal})
        if(this.keyPadRef){
        this.keyPadRef.setVal(newVal);
        }
    }
    applyLimChange = () =>{
      //  console.log("SETTING LIMIT!!!",this.state.measLimInput)
        SecondaryDataManager.getInstance().setVolLimit(this.state.measLimInput);
        
    }
    render(){
        if(this.props.shallRender){
        return(
        <div className="innersecSection">

           
            
            <span style={{color:"white",fontSize:"14px",alignSelf:"left"}}>{this.state.measurementType.name} CH {this.state.measurementChannel}   {this.state.statusUI}</span>
            <div className="lowerSecDiv">
            <KeyPadInput keyPadRef={r => (this.keypad = r)} overrideval={this.state.measurementLimit} className="outLimInput" onEnter={this.applyLimChange} onChange={this.onLimchange}/>
            <button className = "secButton" onClick = {this.openSetup} style={{backgroundColor:color_blue}}>Setup</button>

            </div>
            <div className="sguage">
            <div className = "sflowBox" >
                <div className="sinnerFlowBox" >
                    <div className="sdivider"></div>
                    <div className="sdivider" style={{top:"-35%"}}>{this.state.currentReading}/{this.state.measurementLimit}</div>
                </div>
                <div className="sinnerFlowBoxL" style={{backgroundColor:this.state.guageColor}}>
                    <div className="sdivider"></div>
                    <div className="sdivider" style={{top:"-35%"}}>{this.state.measurementUnit}</div>
                </div>
            </div>
            </div>   
         
            {this.state.seen ? <SecondaryPop volumetric={true} flipped={this.props.flipped} toggle={this.openSetup} onParamUpdate={this.onParamsChanged}/> : null}

        </div>)
        }else return null;
    }


}