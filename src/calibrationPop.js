import React from 'react';

import './offsetPop.css'
import './calibrationPop.css'
import OffsetInput from './keyInput'
import KeyPadInput from './keypadInput';
import DataManager from './DataManager';
import { AccordionAccordion } from 'semantic-ui-react';
const menuStates = {
    topMenu: 0,
    new: 1,
    update: 2,
    load: 3,
    delete: 4
};

const NEW_VAL_FLAG = "$$$ADDNEW"
const empty_calval = 
{
    name:"default",
    flowCal:0,
    volCal:1
}

const new_calval = 
{
    name:"Add New",
    flowCal:0,
    volCal:1
}
const availColor = '#54d3ff';
const navailColor = '#c7f1ff';
const donecolor = 'limegreen';
const unitConversions = {
    'g': 1,
    'kg': 1 / (1000),
    'oz': 28.35,
    'lb': 28.35 * 16
};


function finiteCheck(num,def)
{
    return isFinite(num) ? num : def;
}
export default class CalibrationPop extends React.Component
{

    handleClick = () =>{
        this.props.toggle();
    };
    
    constructor(props)
    {
        super(props);

        this.calibrationList = [];
        this.dataManager = DataManager.getInstance();
        const readData = this.dataManager.getAllData();

        const _Flow = readData.flowData.avgFlow;
        const _Volume = readData.loopState.volSecDerived ? readData.volData.reading * unitConversions[readData.volData.unit] : 0;
        const intVol = readData.flowData.volume;
        this.state = {
            flowOs:0,
            menuState: menuStates.topMenu,
            calibrationList:[],
            calibrationTableItems:[],
            selectedType: empty_calval,
            saveButtonTxt: 'Save Cal.',
            applyButtonTxt: 'Apply Cal',
            saveAvailable:false,
            applyAvailable:false,
            stagedVolume: 1,
            stagedFlow: 0,
            stagedName: '',
            currentVolume: 0,
            currentFlow: 0,
            selFlowCal:0,
            selVolCal:1,
            inputVolCal:1,
            inputFlowCal:0,
            extFlow: 0,
            extVol: _Volume.toFixed(0),
            fcsFlow: _Flow.toFixed(0),
            fcsVol: intVol.toFixed(0),
            flowUpdated: false,
            volUpdated: true,
            cachedSelect: null,
            saveColor: navailColor,
            applyColor: availColor


        }
        
    }
 
    populateTable = () =>{
        
        
        for(var i = 0; i < this.calibrationList.length;i++)
        {
            console.log(this.calibrationList[i].volCal);
            this.state.calibrationTableItems.push(<option key={i} value={JSON.stringify(this.calibrationList[i])}>{this.calibrationList[i].name}</option>)
        }
        this.state.calibrationTableItems.push(<option key={99} value={JSON.stringify(new_calval)}>+ Add New Calibration</option>)
        console.log(this.state.calibrationTableItems)
        this.forceUpdate();
    }

    
    getCalibrations = () =>{
        fetch("http://localhost:3005/getCalibrations")
        .then(res => res.json())
        .then(
            (result) =>{
                console.log('calresult',result);
                this.calibrationList = result;
                for(var i = 0; i < result.length;i++)
                {
                    if(result[i].selected)
                    {
                        this.selectedType = result[i];
                        break;
                    }
                }
                console.log("SELECTED",this.selectedType);
                
                this.populateTable()
                if(this.state.cachedSelect){
                    this.calSelected({target:{value:this.state.cachedSelect}})
                }else{
                    this.calSelected({target:{value:JSON.stringify(this.selectedType)}})
                }
                //console.log(os);
               
            },

            (error)=> {
                
         
            }
        )

    }


    componentDidMount = () =>{
        this.getCalibrations();
        this.setState({inputVolCal: finiteCheck((this.state.fcsVol/this.state.extVol).toFixed(3),1) })
        this.updateStagedValues();
    }

    calSelected = (event) =>{
        console.log("Selected",event.target.value);
        const evVal = JSON.parse(event.target.value);
        this.setState({selectedType:evVal,selFlowCal:evVal.flowCal,selVolCal:evVal.volCal});
        console.log(evVal.name)
        if((evVal.name !== empty_calval.name) && (evVal.name !== new_calval.name))
        {
            console.log("Changing name")
            this.setState({saveAvailable:true});
            this.nameChanged(evVal.name);
        }else{
            this.setState({saveAvailable:false});
            this.setState({stagedName:'',saveButtonTxt:'Save Cal'})
        }

        this.resetValues(evVal.flowCal,evVal.volCal);
    }

    setSaveColor = (color) => {
        this.setState({saveColor:color});
    }
    setApplyColor = (color) => {
        this.setState({applyColor: color});
    }
    resetValues = (flow,vol) => {
        const newStagedFlow = flow + this.state.inputFlowCal;
        var newStagedVol = (vol * this.state.inputVolCal).toFixed(3);
        newStagedVol = finiteCheck(newStagedVol,1);
        this.setState({stagedFlow:newStagedFlow,stagedVolume:newStagedVol});
     
    }
    updateStagedValues = () =>{
        const newStagedFlow = this.state.selFlowCal + this.state.inputFlowCal;
        var newStagedVol = (this.state.selVolCal * this.state.inputVolCal).toFixed(3);
        newStagedVol = finiteCheck(newStagedVol,1);
        this.setState({stagedFlow:newStagedFlow,stagedVolume:newStagedVol});
        this.setSaveColor(availColor);
    }
    fcsFlowUpdate = (val) =>{
        this.setState({flowUpdated:true,fcsFlow:val});
        const newFlowCal = this.state.extFlow - val;
        this.setState({inputFlowCal:newFlowCal});
        this.setSaveColor(availColor);
    }
    extFlowUpdate = (val) =>{
        this.setState({flowUpdated:true,extFlow:val});
        const newFlowCal = val - this.state.fcsFlow;
        this.setState({inputFlowCal:newFlowCal});
        this.setSaveColor(availColor);
    }
    fcsVolUpdate = (val) =>{
        this.setState({volUpdated:true,fcsVol:val});
        var newVolCal = val / this.state.extVol;
        newVolCal = finiteCheck(newVolCal,1);
        this.setState({inputVolCal:newVolCal.toFixed(3)});
        this.setSaveColor(availColor)
    }
    extVolUpdate = (val) =>{
        this.setState({volUpdated:true,extVol:val});
        var newVolCal = this.state.fcsVol / val;
        newVolCal = finiteCheck(newVolCal,1);
        this.setState({inputVolCal:newVolCal.toFixed(3)});
        this.setSaveColor(availColor);
    }

    saveStaged = () =>{

        const reqBody = JSON.stringify({
            name:this.state.stagedName,
            volCal:this.state.stagedVolume,
            flowCal:this.state.stagedFlow
        })
        const requestOptions = {
            method: 'POST',
    
            headers: {'Content-Type':'application/json'},
            body: reqBody
        }
        //(requestOptions.body)
        fetch("http://localhost:3005/addCalibration",requestOptions)
        .then(res => res.json())
        .then(
            (result) =>{
                this.setSaveColor(donecolor);
                this.setApplyColor(availColor);
                console.log(result);
                this.state.calibrationTableItems = [];
                this.state.cachedSelect = reqBody;
                this.getCalibrations();
                
            },

            (error)=> {
             
            }
        )
    }

    applyCal = () => {
        console.log("applying",this.state.selectedType);

        const reqBody = JSON.stringify(this.state.selectedType)
        const requestOptions = {
            method: 'POST',
    
            headers: {'Content-Type':'application/json'},
            body: reqBody
        }
        //(requestOptions.body)
        fetch("http://localhost:3005/applyCalibration",requestOptions)
        .then(res => res.json())
        .then(
            (result) =>{
                this.setApplyColor(donecolor);
            },

            (error)=> {
             
            }
        )
    }
    renderInputs = () =>{
        return(<div style={{height:'60%',flex:2,marginLeft:'15%',marginTop:'1%'}}>
                <div style={{display:'flex',flexDirection:'row'}}>
                <div style={{flex:1,display:'flex',flexDirection:'column',height:'20%'}}>
                <span>Flow Current (FCS Measured) Value:</span>
                <KeyPadInput initVal={this.state.fcsFlow} onChange={this.fcsFlowUpdate} onEnter={this.updateStagedValues}/>
                <span>Flow Wanted (Ext. Measured) Value:</span>
                <KeyPadInput initVal={this.state.extFlow} onChange={this.extFlowUpdate} onEnter={this.updateStagedValues}/>
                </div>
                <div style={{flex:1,display:'flex',flexDirection:'column'}}>
                <span>Volume Current (FCS Measured) Value:</span>
                <KeyPadInput initVal={this.state.fcsVol} onChange={this.fcsVolUpdate} onEnter={this.updateStagedValues}/>
                <span>Volume Wanted (Ext. Measured) Value:</span>
                <KeyPadInput initVal={this.state.extVol} onChange={this.extVolUpdate} onEnter={this.updateStagedValues}/>
                </div>
                </div>
            </div>)

    }
    renderButtons = () =>{
        return(
            <div style={{display:'flex',marginTop:'1%'}}>
                <div className='butCont'>
                <button className="calButton" onClick={this.saveStaged} style={{backgroundColor:this.state.saveAvailable ? this.state.saveColor : navailColor}}>{this.state.saveButtonTxt}</button>
                </div>
                <div className='butCont'>
                <button className="calButton" onClick={this.applyCal} style={{backgroundColor:this.state.applyColor}}>{this.state.applyButtonTxt}</button>
                </div>
            </div>
        )
    }
    nameChanged = (newVal) => {
        console.log("Name Changed",newVal);
        const saveStr = `Save Cal (Staged -> ${newVal})`
        this.setState({stagedName:newVal,saveButtonTxt:saveStr,saveAvailable:true})
    }
    renderNameInput = () =>{
        return(
        <div style={{visibility: this.state.selectedType.name === new_calval.name ? "visible" : "hidden",marginTop:"1%"}}>
            <span style={{marginLeft:'15%'}}>Name: </span>
            <KeyPadInput fullKeyboard={true} onChange={this.nameChanged}/>
        </div>
        )
    }
    renderSelectedValues = () =>{
        return(
            <div style={{display:'flex',flexDirection:'row'}}>
                <div style={{display:'flex',flexDirection:'column',marginRight:'27%',marginLeft:'15%'}}>
                <span>Selected Flow Cal: {this.state.selFlowCal}</span>
                <span>Input Flow Cal. (EXT-FCS): {this.state.inputFlowCal}</span>
                <span>Staged Flow Cal: {this.state.stagedFlow}</span>
                </div>
                <div style={{display:'flex',flexDirection:'column'}}>
                <span>Selected Volume Cal: {this.state.selVolCal}</span>
                <span>Input Vol Cal. (FCS/EXT): {this.state.inputVolCal}</span>
                <span>Staged Volume Cal: {this.state.stagedVolume}</span>
                </div>
            </div>
        )
    }
    renderContent = () =>{
        return(
            <div style={{display:'flex',flexDirection:'column'}}>
            <div className='seldiv'>
            <div className='listTitle'>Saved Calibrations</div>
            <select className="selectDrop" size="8" id="calselectbox" value={JSON.stringify(this.state.selectedType)} onChange={this.calSelected}>
                    {this.state.calibrationTableItems}
            </select>
            
            </div>
            <span className="selectedSpan">Selected: {this.state.selectedType.name}</span>
            {this.renderInputs()}
            {this.renderNameInput()}
            {this.renderSelectedValues()}
            {this.renderButtons()}
            </div>
        )
    }
    render(){
        return(
            <div className="modalz">
            <div className="modal_content">
                <div className="modalTopBar">
                    <div className="modalTitlez"><div className="titletext">Calibration</div></div>
                <div className="exitButtonz" onClick={this.handleClick}><div style={{display:"table-cell",verticalAlign:"middle",fontSize:"30px",fontWeight:"bold"}}>&times;</div></div>
                
                </div>
                {this.renderContent()}
                
            </div>
        </div>
        );
    }
}