import React from 'react';
import './components.css'
import { faSyncAlt, faWifi } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import WifiPop from './wifiPop';
import DataManager from './DataManager';
export default class Header extends React.Component
{
    state = {
        serialNum:'N/A',
        seen:false,
        hasInternet:false,
        wifiColor:'red'
    }

    getSerialNumber = () =>{
       
        var snum = DataManager.getInstance().getStateData().serialNum;
        this.setState({serialNum:snum});
                
          
    }

    startSerialScan = () =>{
        setInterval(this.getSerialNumber,2500);
    }
    rotatePressed = () =>{
        //console.log("Rotate Pressed")
        this.props.rotatePressed()
    }

    showWifiModal = () =>{
        
        this.setState({seen:!this.state.seen})
        //console.log("Wifi Pressed",this.state.seen)
    }
    checkInternet = () =>{
      
        fetch('http://localhost:3011/checkConn')
        .then(res => res.json())
        .then(
            (result) =>{
                var color = 'red';
                //console.log(result)
                if(result.hasInternet) color = 'limegreen';
                //console.log(color)
                this.setState({hasInternet:result.hasInternet,wifiColor:color})
            },
            (error)=> {
               
            }
        )
        
    }
    componentDidMount = () =>{
        //console.log(this.state.seen)
        this.checkInternet()
        setInterval(this.checkInternet,5000);
        this.startSerialScan();
    }
    render()
    {
        return(<h1 className="mainHeader">
             <button className="wifiButton" onClick={this.showWifiModal}><FontAwesomeIcon icon = {faWifi} style={{'padding':5}}  color={this.state.wifiColor}></FontAwesomeIcon></button>
            <div style={{left:'43%',top:'-0.5%',position:'absolute',fontSize:17,justifyContent:'center'}}><span style={{fontSize:window.innerHeight * 0.05}}>FCS</span> [S/N:{this.state.serialNum}]</div>
            <button className="rotateButton" onClick={this.rotatePressed}><FontAwesomeIcon icon = {faSyncAlt} style={{'padding':5}}  color="white"></FontAwesomeIcon></button>
            {this.state.seen ? <WifiPop flipped={this.props.flipped} hasInternet={this.state.hasInternet} toggle={this.showWifiModal} /> : null}
            </h1>);
    }
}