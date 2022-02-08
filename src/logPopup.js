import React from 'react';
import './components.css'
import './loggingModule.css'

const rainbowScan = ['#297EE3','#6729E3','#E329C7','#F44353','#FC9B4F','#0EBAD5'];
var rbIndex = 0;

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
export default class LogPopup extends React.Component
{
 
    state = {
        bUsbStat : false,
        SusbStat : 'No USB Drive Found',
        statColor : "red",
        fSaveStat : "Save",
        fName : this.props.fName,
        saveColor: '#0EBAD5',
        intervalId: 0
    }
    handleClick = () =>{
        this.props.toggle();
    };
    getFile = () =>{
        fetch("http://localhost:3005/filename")
        .then(res => res.json())
        .then(
            (result) =>{
                const fn = result.fileName;
                this.setState({fName:fn})
                this.forceUpdate()
            },

            (error)=> {
             
            }
        )
    };
    refreshFile = () =>{
        this.props.getFile();
    }

    scanButtonColors = () =>{
        //console.log('Setting Button Color at index ' + rbIndex)
        this.setState({saveColor:rainbowScan[rbIndex]});
        rbIndex += 1;
        if(rbIndex >= rainbowScan.length) rbIndex = 0;
    }

    startScan = () =>{
        var intervalIds = setInterval(this.scanButtonColors,500);
        this.setState({intervalId:intervalIds})
        //console.log("Pressasded")
    }

    stopScan = () =>{
        clearInterval(this.state.intervalId);
        this.setState({saveColor:'#0EBAD5'})
    }
    saveFile = () =>{
        //console.log("Pressed")

        
        
        //this.setState({saveColor:'#0EBAD5'})
        if(this.state.bUsbStat){

            this.setState({fSaveStat:'Saving'});
            this.startScan();
            fetch("http://localhost:3005/savecsv")
            .then(res => res.json())
            .then(
                (result) =>{
                    this.setState({fSaveStat:"Saved"})
                    this.stopScan();
                },

                (error)=> {
                    
                }
            )
        }

        
        
    };
    refreshUsbStat = () =>{
        //console.log('Saving')
        fetch("http://localhost:3005/usbstat")
        .then(res => res.json())
        .then(
            (result) =>{
                const usbstat = result.usbStatus;
                
                if(usbstat == 1)
                {
                    this.setState({bUsbStat:true,SusbStat:'USB Drive Connected',statColor:"LightGreen"})
                }
                else
                {
                    this.setState({bUsbStat:false,SusbStat:'No USB Drive Found',statColor:"LightCoral"})
                }
                
            },

            (error)=> {
             
            }
        )

        this.getFile();
    };
    render()
    {
        return(
            <div className="modal" style={{height:"40%",width:"40%",top:"30%",left:"30%"}}>
                <div className="modal_contentl">
                <div className="modalTopBarl">
                        <div className="modalTitlel"><div className="titletext">Log Flow Data</div></div>
                        <div className="exitButtonl" onClick={this.handleClick}><div style={{display:"table-cell",verticalAlign:"middle",fontSize:"30px",fontWeight:"bold"}}>&times;</div></div>
                    </div>
                    <div className="statBar">
                        <div className = "usbStatBar" style={{background:this.state.statColor}}><div className="ttable"><p className="statTxt">{this.state.SusbStat}</p></div></div>
                        <button className = "refButton" onClick={this.refreshUsbStat}>Refresh</button>
                    </div>
                    <div className= "fileBar">
                        <div className = "filenamebar" ><div className="ttable"><p className="statTxt" style={{fontSize:"11px"}}>{this.state.fName}</p></div></div>
                        <button className = "refButton" style={{backgroundColor:this.state.saveColor}}onClick={this.saveFile} >{this.state.fSaveStat}</button>
                    </div>
                </div>
            </div>
        );
    }
}