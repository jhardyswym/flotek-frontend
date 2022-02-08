import React from 'react';
import './components.css'
import LogPopUp from './logPopup'

export default class LogButton extends React.Component
{
    state = {
        seen:0,
        loggingMsg:'Start Logging',
        fName : "",
        sColor: '#ed2f2f',
    };

    getFileName = () =>{
        //console.log("Getting fname")
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
    }
    togglePop = () =>{
        var newSeen = 0
        newSeen = this.state.seen;
        //console.log(newSeen);
        this.getFileName();
        switch(newSeen){
            
            case 0:
                this.setState({loggingMsg:'Stop Logging'});
                this.setState({sColor:'#5fe86d'})
                this.startLogging();
                this.props.logState(true);
                break;
            case 1:
                this.setState({loggingMsg:'Save Log'})
                this.setState({sColor:'#5bace3'})
                this.stopLogging();
                this.getFileName();
                this.props.logState(false);
                break;
            case 2:
                
                this.setState({loggingMsg:'Start Logging'})
                this.setState({sColor:'#ed2f2f'})
                
                
            
        }
        
        this.forceUpdate();
        newSeen = this.state.seen > 2 ? 0 : this.state.seen + 1;
        this.setState({seen: newSeen});
    };

    startLogging = () =>{
        fetch("http://localhost:3005/startlog")
        .then(res => res.json())
        .then(
            (result) =>{
                
                
            },

            (error)=> {
             
            }
        )
    };

    stopLogging = () =>{
        fetch("http://localhost:3005/stoplog")
        .then(res => res.json())
        .then(
            (result) =>{
                
               
                
            },

            (error)=> {
             
            }
        )
    };

    render()
    {
        return(
            <div>
                <button className="logButton" style={{backgroundColor:this.state.sColor}} onClick={this.togglePop}>{this.state.loggingMsg}</button>
                {this.state.seen > 2 ? <LogPopUp toggle={this.togglePop} fName = {this.state.fName} /> : null}
            </div>
        );
    }
}