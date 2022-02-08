import React from 'react';

import './offsetPop.css'
import OffsetInput from './keyInput'
export default class OffsetPop extends React.Component
{

    handleClick = () =>{
        this.props.toggle();
    };
    state = {
        flowOs:0
    }
    getOffset = () =>{
        fetch("http://localhost:3005/getOffset")
        .then(res => res.json())
        .then(
            (result) =>{
                //console.log("GOT FLOW OFFSET ")
                const os = result.offset;
                this.setState({flowOs:os});
                //console.log(os);
               
            },

            (error)=> {
                
         
            }
        )
    }



    componentDidMount = () =>{
        this.getOffset();
    }
    render(){
        return(
            <div className="modal" style={{height:"40%",width:"40%",top:"30%",left:"30%"}}>
            <div className="modal_content">
                <div className="modalTopBar">
                    <div className="modalTitlez"><div className="titletext">Set Flow Calibration (Current: {this.state.flowOs})</div></div>
                <div className="exitButtonz" onClick={this.handleClick}><div style={{display:"table-cell",verticalAlign:"middle",fontSize:"30px",fontWeight:"bold"}}>&times;</div></div>
                </div>
                
                <OffsetInput osType={'0'} closeFunc ={this.handleClick}/>
            </div>
        </div>
        );
    }
}