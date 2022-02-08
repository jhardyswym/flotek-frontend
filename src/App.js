import React from 'react';
import './App.css';
import Header from './header.js'
import GraphContainer from './graph.js'
import FlowGuage from './flowGuage';
import VolumeGuage from './volGuage';
import TareButton from './tareButton';
import LogButton from './logButton';
import StopButton from './stopButton';
import OffsetButton from './offsetButton';
import LogNotifier from './logNotifier';
import PidButton from './pidButton';
import InfluxGraph from './InfluxGraph';
import PidSelector from './pidSelector';
import OffsetButtonVol from './offsetButtonvol';
import SecondaryPanel from './secondaryPanel';
import EnvManager from './envManager';
import PurgeButton from './purgeButton';
import PrimeButton from './primeButton';
import VolumetricPanel from './volumetricPanel';
import SecondaryMenu from './secondaryMenu';
import DataManager from './DataManager';
var FLIP_CHANGED = 0;
var PREV_FLIP = 0;
var GOT_KP = true;
export default class App extends React.Component {

  constructor(props){
    super(props);
    this.updateLogState = this.updateLogState.bind(this);
    this.updatePidState = this.updatePidState.bind(this);
    this.rotateScreen = this.rotateScreen.bind(this);
    
    this.state = {
      logState : false,
      pidState: 0,
      screenRotation:"appContainer",
      flipped:false,
      viewReady:false
    }
  }

  
  updateLogState(state){
    //console.log('Setting Log State')
    this.setState({logState:state})
  }

  updatePidState(state){
    this.setState({pidState:state})
    //console.log(this.state.pidState)
  }
  rotateScreen(){

    if(this.state.screenRotation.valueOf() === "appContainer".valueOf()){
      //console.log("Flip down")

      this.setState({screenRotation:"appContainerFlip",flipped:true})
      FLIP_CHANGED = 1;
    }
    else{
      //console.log("flip up")
  
      FLIP_CHANGED = 0;
      this.setState({screenRotation:"appContainer",flipped:false})
    }
  }
  assertRotate = () =>{
    const envMan = EnvManager.getInstance();
    if(envMan.shouldRotate()){
      this.rotateScreen();
    }
    this.setState({viewReady:true});
  }
  loadEnvs = () =>{
    const envMan = EnvManager.getInstance();
    envMan.loadVariables();
    if(!envMan.envsLoaded()){
      setTimeout(this.loadEnvs,10);
    }
    else{
      this.assertRotate();
    }
  }

  socketListener(data)
  {
  //  console.log(data);
  }
  componentDidMount(){
    window.addEventListener("contextmenu", function(e) { e.preventDefault(); })
    DataManager.getInstance();

    
    this.loadEnvs();

  }
  render() {
    return (
      <div className={this.state.screenRotation}>
        {
          // !this.state.viewReady && <div style={{backgroundColor:'white',position:'absolute',height:'100%',width:'100%',zIndex:5000}}/>
        }
        <Header rotatePressed = {this.rotateScreen} />
        <div className="leftPanel">
        <InfluxGraph controlState = {this.state.pidState}/>
        </div>
        <div className="rightPanel">
        <LogNotifier logState = {this.state.logState}/>
        <PidSelector OnStateChange = {this.updatePidState}/>
        <SecondaryMenu OnStateChange = {this.updatePidState} flipped={this.state.flipped}/>
    
        <FlowGuage />
        <VolumeGuage />
        
        <div className="rButtonDiv">
      
        <OffsetButton/>
       

       
        <TareButton />
        <LogButton logState = {this.updateLogState}/>
        <PrimeButton/>
        {/* <PurgeButton/> */}
        <StopButton />
        {/* <PidButton /> */}
        </div>
        </div>
      </div>
    );
  }
}
