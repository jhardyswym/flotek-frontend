import React from 'react';
import './components.css'

export default class LogNotifier extends React.Component
{
    state = {
        logStatus: "Not Logging!",
        logState: this.props.logState
    }

    update = () =>{
        this.setState({logStatus:"Logging"});
    };
    componentDidUpdate(prevProps){
        if(this.props.logState !== prevProps.logState)
        {
            this.setState({logState:!this.state.logState})
        }
    }
    render(){

        return(

             <div>
           
                 {this.state.logState === false &&
                 <div className = "logNotifierMain" style= {{backgroundColor:"red"}}>
                <div className = "logNotText">Not Logging!</div>
                </div>
                }
              </div>  
            





        );


    }

}