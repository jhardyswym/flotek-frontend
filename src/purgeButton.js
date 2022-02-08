import React from 'react';

import './components.css'
import { wait } from '@testing-library/react';


export default class PurgeButton extends React.Component
{
    
    constructor(props)
    {
       
        super(props);
        this.state = {
            purging:false,
            color:'white'
        }
    }

    holdStart = () =>{
        //console.log("HOLDING PURGE BUTTON");
        this.setState({purging:true,color:'limegreen'})
    }

    holdEnd = () =>{
        //console.log("RELEASE PURGE BUTTON");
        this.setState({purging:false,color:'white'})
    }
    render()
    {
        return(
            <div>
                <button className="purgeButton" style={{backgroundColor:this.state.color}} onMouseDown={this.holdStart} onMouseUp={this.holdEnd}>Max Purge</button>

          </div>
           
        );
    }
}