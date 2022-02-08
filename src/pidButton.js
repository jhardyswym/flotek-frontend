import React from 'react';
import './components.css';
import PidPopup from './pidPopup';
import './pidselector.css'

export default class PidButton extends React.Component
{   
    state = {
        seen:false,
        kp:0,
        ki:0,
        kd:0,
        vl:0
    };

    OnButtonPressed = () =>{
        this.setState({seen:!this.state.seen})
    }

    SetParams = (_kp,_ki,_kd,_vl) =>{
            this.setState({
                kp:_kp,
                ki:_ki,
                kd:_kd,
                vl:_vl
            });
    }

    componentDidMount = () =>
    {
        //console.log("GETTING PARAMS")
        fetch("http://localhost:3005/getParams")
        .then(res => res.json())
        .then(
            (result) =>{
                
                this.SetParams(result.kp,result.ki,result.kd,result.vl)
               
            },

            (error)=> {
                
                
            }
        )
    }

    render()
    {
        return(
        <div>
            <button className="settingsButton" onClick={this.OnButtonPressed}>{this.props.icon}</button>
            {this.state.seen ? <PidPopup toggle={this.OnButtonPressed} onSet={this.SetParams} toggle={this.OnButtonPressed} kp={this.state.kp} ki={this.state.ki} kd={this.state.kd} volLim={this.state.vl}/> : null}
        </div>
        );
    }


}