import React from 'react';
import './components.css'
import DataManager from './DataManager';
import UIController from './uIController';

export default class PrimeButton extends React.Component
{
    state = {
        seen:0,
        loggingMsg:'Start Logging',
        fName : "",
        sColor: '#60E570',
    };

    available = true;
    sendBackend = (state) => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                state:state
         
            })

            
        }

        fetch("http://localhost:3005/prime",requestOptions)
        .then(res => res.json())
        .then(
            (result) =>{
                
                
            },

            (error)=> {
             
            }
        )
    }
    setHeld = () =>{
        if(!this.available) return;
        this.setState({sColor:"red"});
        this.sendBackend(true);
    }
    setReleased = () =>{
        if(!this.available) return;
        this.setState({sColor:"#60E570"});
        this.sendBackend(false);
    }
    ssFunc = (state) =>{
        this.available = !state;
        var _color = "grey";
        if(!state){
            _color = "#60E570";
        }
        //console.log('sdasddasd')
        this.setState({sColor:_color});
    }
    componentDidMount = () =>{
        DataManager.getInstance().OnRunningChange(this.ssFunc);
    }
    render()
    {
        return(
            <div>
                <button className="primeButton" style={{backgroundColor:this.state.sColor}} onTouchStart={this.setHeld} onTouchEnd={this.setReleased} onMouseDown={this.setHeld} onMouseUp={this.setReleased}>Prime</button>
      
            </div>
        );
    }
}