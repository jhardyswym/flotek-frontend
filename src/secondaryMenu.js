import React from 'react'
import './components.css'
import './secondaryPanel.css'
import SecondaryPanel from './secondaryPanel';
import VolumetricPanel from './volumetricPanel';
const TAB_STATE_FLOW = 0;
const TAB_STATE_VOL = 1;
const COLOR_TAB_SEL = 'dodgerblue';
const COLOR_TAB_NONSEL = '#8cc6ff'
export default class SecondaryMenu extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            tabState : TAB_STATE_FLOW,
            flowColor: COLOR_TAB_SEL,
            volColor: COLOR_TAB_NONSEL
        };

    }
    selectFlow = () =>
    {
        if(this.state.tabState === TAB_STATE_FLOW) return;

        this.setState({
            tabState: TAB_STATE_FLOW,
            flowColor:COLOR_TAB_SEL,
            volColor: COLOR_TAB_NONSEL
        });
    }

    selectVolume = () =>{
        if(this.state.tabState === TAB_STATE_VOL) return;

        this.setState({
            tabState: TAB_STATE_VOL,
            flowColor:COLOR_TAB_NONSEL,
            volColor:COLOR_TAB_SEL
        });
    }
    render()
    {
        return(
            <div className='secSection'>
            <div style={{color:"white",fontSize:"18px",textAlign:'center',width:'100%'}}>Secondary Control</div>
            <div className='secTabContainer'>
                <div className='secTab' style={{backgroundColor:this.state.flowColor}} onClick={this.selectFlow}>Flow</div>
                <div className='secTab' style={{backgroundColor:this.state.volColor}} onClick={this.selectVolume}>Volume</div>
            </div>
            {/* FLOW PANEL */}
      
            <SecondaryPanel OnStateChange = {this.props.updatePidState} flipped={this.props.flipped} shallRender={!this.state.tabState}/>
           
            {/* VOLUME PANEL */}
     
            <VolumetricPanel OnStateChange = {this.props.updatePidState} flipped={this.props.flipped} shallRender={this.state.tabState}/>
           
            </div>
        )
    }
}