import React from 'react'
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import './kpInput.css'
const numpadLayout = {
    default:[
            '{enter} {bksp}',
                '1 2 3',
                '4 5 6',
                '7 8 9',
                '- 0 .'
    ]
}


export default class KeyPadInput extends React.Component
{
    constructor(props)
    {
        super(props);
        var str = "";

        this.state = {
            kpStrValue:"",
            seen:false,
            borderColor:'grey'
        }
        
    }
    componentDidMount = () =>{
       // console.log("did mount")
        if(this.props.initVal != undefined){
            //console.log("GOT INIT VAL",this.props.initVal)
            this.setState({kpStrValue:String(this.props.initVal)});
        }

        if(this.props.keyPadRef)
        {
            this.props.keyPadRef(this);
        }
    }
    onSelect = () =>{
        //console.log("KP SEEN")

        this.setState({seen:true,borderColor:'limegreen'});
        if(this.props.overrideval !== undefined){
            this.setState({kpStrValue:String(this.props.overrideval)})
        }
    }

    onBlur = () =>{
        
    }
    setVal = (val) =>{
        this.setState({kpStrValue:val});
    }
    onChanged = (input) =>{
        //console.log("changed")
        var _in = "0";
        if(input !== "") _in = input
        this.setState({kpStrValue:_in});

        if(this.props.fullKeyboard){
            this.props.onChange(_in);
            return;
        }
        var f_in = 0;
        try{
            f_in = parseFloat(_in);
        }catch{
            return;
        }

        if(isNaN(f_in)){
            f_in = 0;
        }
        this.props.onChange(f_in);
    }

    inputChange = (event) =>{
        // var f_in = 0
        //console.log("on in change ",event.target.value)
     
    }

    onKeyPress = (button) =>{
     //   console.log("button pressed",button)
        if(button === '{enter}'){
            //console.log('enter pressed')
            if(this.props.onEnter){
                this.props.onEnter();
            }
            this.keyboard.destroy();
            this.setState({seen:false,borderColor:'grey'})
        }

        if(button === '{bksp}'){
            const strChange = this.state.kpStrValue.slice(0,-1);
            this.onChanged(strChange);
        }
    }
    kbBlur = () =>{
       // console.log('kbblur')
        this.setState({seen:false,borderColor:'grey'})
    }

   
    render()
    {
        return(
            <>
            <input className={this.props.className} style={{margin:'3px',border:'3px solid',borderColor:this.state.borderColor}}name="kpinput" value={(this.props.overrideval && !this.state.seen) ? this.props.overrideval : this.state.kpStrValue} onChange={this.inputChange} onSelect={this.onSelect} onBlur={this.onBlur}></input>
            {this.state.seen ?
                        <div className="kpFloatDiv">
                        <Keyboard
                      
                        keyboardRef={r => (this.keyboard = r)}
                        layout = {this.props.fullKeyboard ? null : numpadLayout}
                        layoutName = "default"
                        onChange={this.onChanged}
                        onKeyPress={this.onKeyPress} 
                        onBlur={this.kbBlur}
                        /> 
                        </div> : null}
            </>
        )
    }
}