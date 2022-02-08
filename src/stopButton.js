import React from 'react';
import './components.css'
import DataManager from './DataManager';
import UIController from './uIController';

export default class TareButton extends React.Component
{
    constructor(props)
    {
        super(props);
        this.StartStop.bind(this);
        this.state = {
            status: false,
            buttonText: 'Start',
            color: '#60E570'
        };
        this._int = -9999;
    }

    checkVolStat = () =>{
        fetch("http://localhost:3005/getVolrs")
        .then(res => res.json())
        .then(
            (result) =>{
                const stat = result.status;

                if(stat === 1){
                   // console.log("start")
                    //UIController.getInstance().onStopStartPushed(false);
                    clearInterval(this._int);
                    this.setState({buttonText:'Start',status:false,color:'#60E570'});
                }
                else{
                   // console.log("stop")
                    //UIController.getInstance().onStopStartPushed(true);
                    this.setState({buttonText:'Stop',status:true,color:'#F85151'});
                    
                }
                
            },

            (error)=> {
             
            }
        )
    }
    StartStop()
    {
        if(this.state.status)
        {
            fetch("http://localhost:3005/stop")
        .then(res => res.json())
        .then(
            (result) =>{
                
                
            },

            (error)=> {
             
            }
        )
            //Stop
            //UIController.getInstance().onStopStartPushed(false);
            //clearInterval(this._int);
            //this.setState({buttonText:'Start',status:false,color:'#60E570'});
        }
        else
        {
            fetch("http://localhost:3005/start")
        .then(res => res.json())
        .then(
            (result) =>{
                
                
            },

            (error)=> {
             
            }
        )
            //Start
            
            //this.setState({buttonText:'Stop',status:true,color:'#F85151'});
          
            
        }
    }

    assertState = (state) =>{
        if(state)
        {
            this.setState({buttonText:'Stop',status:true,color:'#F85151'});
        }else{
            this.setState({buttonText:'Start',status:false,color:'#60E570'});
        }
    }
    componentDidMount = ()=>{
        DataManager.getInstance().OnRunningChange(this.assertState);
    }
    render()
    {
        return(
          <button className="stopButton" style={{backgroundColor:this.state.color}} onClick={() => {this.StartStop()}}>{this.state.buttonText}</button>
           
        );
    }
}