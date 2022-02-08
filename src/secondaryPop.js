import React from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { FormTextArea, Sidebar } from 'semantic-ui-react';
import './secondaryPop.css'
import { SecondarySelections, VolumetricSelections } from './secondaries';
import SecondaryDataManager from './secondaryDataManager';
import KeyPadInput from './keypadInput';

const color_blue = '#54D3FF';
const color_green = '#47F185';
const numpadLayout = {
    default:[
            '{enter} {bksp}',
                '1 2 3',
                '4 5 6',
                '7 8 9',
                '- 0 .'
    ]
}
export default class SecondaryPop extends React.Component {

    handleClick = () => {
        this.props.toggle();
    };

    constructor(props)
    {
        super(props);
        this.__sel = SecondarySelections;
        if(this.props.volumetric)
        {
           this.__sel = VolumetricSelections;
        }

        this.state = {
            selectedType: this.__sel[0],
            selectedTypeIdx: 0,
            selectedUnit: "",
            selectedChannel: 1,
            typeList: [],
            unitList: [],
            channelList: [],
            selectedLimit:0,
            selectedLimitStr:"0",
            showKeyboard: false,
            confirmColor:color_blue,
            volSelected:false
        }
    
    }



    buttonBlue = () =>{
        this.setState({confirmColor:color_blue});
    }

    buttonGreen = () =>{
        this.setState({confirmColor:color_green});
    }
    onChange = (input) => {
        this.setState({ selectedLimitStr: input })
        this.buttonBlue();
    }
    onKeyPress = (button) => {
        if (button === "{shift}" || button === "{lock}") this.handleShift();
        else this.setState({ layoutName: "default" });
    }

    populateLists = () => {

        for (var i = 0; i < this.__sel.length; i++) {
            this.state.typeList.push(<option value={JSON.stringify(this.__sel[i])}>{this.__sel[i].name}</option>);
        }

        this.forceUpdate();
    }
    populateUnits = (type) => {
        this.state.unitList = [];

        for (var i = 0; i < type.units.length; i++) {
            this.state.unitList.push(<option value={JSON.stringify(type.units[i])}>{type.units[i]}</option>)
        }
    }

    populateChannels = (type) =>{
        this.state.channelList = [];
        for(var i = 0; i < type.channels.length;i++){
            this.state.channelList.push(<option value={JSON.stringify(type.channels[i])}>{type.channels[i]}</option>)
        }
    }
    typeSelected = (event) => {
       
        // if (selType !== this.state.selectedType) {
        //     this.populateUnits(selType);
        // }
        
        const val = JSON.parse(event.target.value);
        this.populateUnits(val)
        this.populateChannels(val)
        //console.log("Selected Sensor Type: ",val.name);
        this.setState({ selectedType: val,selectedUnit:val.units[0],selectedChannel:val.channels[0], volSelected:val.volumetric});
        this.buttonBlue();

    }
    unitSelected = (event) => {
        const val = JSON.parse(event.target.value);
        //console.log("Selected Unit: ",val);
        this.setState({selectedUnit: val});
        this.buttonBlue();
    }

    channelSelected = (event) =>{
        const val = JSON.parse(event.target.value);
        //console.log("Selected Channel: ",val);
        this.setState({selectedChannel:val})
        this.buttonBlue();
    }
    getTypeIdx = () =>{
        return this.__sel.indexOf(this.state.selectedType);
    }

    SetParams = () =>{

        const f_limit = parseFloat(this.state.selectedLimitStr);

        //console.log("Setting Params: ")
        //console.log("Type: ",this.state.selectedType.name);
        //console.log("Units: ",this.state.selectedUnit);
        //console.log("Channel: ",this.state.selectedChannel);
        //console.log("Limit: ",f_limit);
        if(this.props.volumetric === undefined){
        SecondaryDataManager.getInstance().setParams(this.state.selectedType,this.state.selectedUnit,this.state.selectedChannel,f_limit);
        }else{
            SecondaryDataManager.getInstance().setVolParams(this.state.selectedType,this.state.selectedUnit,this.state.selectedChannel,f_limit); 
        }
        this.props.onParamUpdate();
        this.buttonGreen();
        
    }
    componentDidMount = () => {
        //console.log("Secondary POP SHOWN")

        this.populateLists();
    }
    limSelect = () =>{
        this.setState({showKeyboard:true});
    }

    limBlurred = () =>{
        
    }

    limChanged = (event) =>{
        var limStr = event.target.value;
     

        this.setState({selectedLimitStr:limStr});
    }
    renderConnect = () => {
        return (
            <div className="modalz">
                <div className="modal_content">
                    <div className="modalTopBar">
                        <div className="modalTitlez"><div className="titletext">Select Secondary Process Variable</div></div>
                        <div className="exitButtonx" onClick={this.handleClick}><div style={{ display: "table-cell", verticalAlign: "middle", fontSize: "30px", fontWeight: "bold" }}>&times;</div></div>
                    </div>
                    <form className="secForm">
                        <div className="formDivwLabel">
                            <label className="secformLabel">Sensor Type:</label>
                            <select className="mainUnitDropdown" size="8" id="selectbox" value={JSON.stringify(this.state.selectedType)} onChange={this.typeSelected}>
                                {this.state.typeList}
                            </select>
                        </div>
                        <div className="formDivwLabel">
                            <label className="secformLabel">Units:</label>
                            <select className="mainUnitDropdown" size="8" id="selectbox" value={JSON.stringify(this.state.selectedUnit)} onChange={this.unitSelected}>
                                {this.state.unitList}
                            </select>
                        </div>

                        <div className="formDivwLabel">
                        <label className="secformLabel">Channel:</label>
                            <select className="mainUnitDropdown" size="8" id="selectbox" value={JSON.stringify(this.state.selectedChannel)} onChange={this.channelSelected}>
                                {this.state.channelList}
                            </select>     
                        </div>

                    </form>

                    <div className="limContainer">
                        {!this.state.volSelected ?
                        <>
                        <span className="limPref">Setpoint: </span>
                        <KeyPadInput className="limInput" onChange={this.onChange}/>
                        <span className="limSuff">{this.state.selectedUnit}</span>
                        </>
                        :
                        <span style={{left:'12%',position:'absolute'}}>Volume to Dispense Set in PID Menu.</span>
                        }
                        {/* <input className="limInput" type="text" name="limInput" value={this.state.selectedLimitStr} onChange={this.limChanged} onSelect={this.limSelect} onBlur={this.limBlurred}></input> */}
                        
                    </div>
                    <button className="confirmButton" style={{backgroundColor:this.state.confirmColor}} onClick={this.SetParams}>Confirm</button>

                </div>

               
            </div>


        );
    }


    renderContent = () => {

        return this.renderConnect();

    }
    render() {
        return (
            <>
                {this.renderContent()}
            </>
        )
    }
}