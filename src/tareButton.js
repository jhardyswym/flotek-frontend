import React from 'react';

import './components.css'
import { wait } from '@testing-library/react';


export default class TareButton extends React.Component
{
    
    constructor(props)
    {
       
        super(props);
        this.state = {
            zeroing:false,
        }
        this.ZeroSensor.bind(this);
    }

 

    ZeroSensor()
    {
        this.setState({zeroing:true})
        fetch("http://localhost:3005/zero")
        .then(res => res.json())
        .then(
            (result) =>{
                
                
            },

            (error)=> {
             
            }
        )
        setTimeout(this.unfocus, 3000);
        
        
    }
    unfocus = () =>{
        this.setState({zeroing:false})
        //console.log("dz")
    }
    render()
    {
        return(
            <div>
            {this.state.zeroing === false &&
                <button className="tareButton" onClick={() => {this.ZeroSensor()}}>Tare</button>
            }
            {this.state.zeroing === true &&
                <button className="tareButtonfocus" onClick={() => {this.ZeroSensor()}}>Tare</button>  
            }
          </div>
           
        );
    }
}