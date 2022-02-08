import React from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import './wifiPop.css'
export default class WifiPop extends React.Component
{

    handleClick = () =>{
        this.props.toggle();
    };
    state = {
        statusText:'Fetching Nearby WiFi Connections...',
        ssidList:[],
        selectSsid:"Select Wifi Connection",
        selectPassword:"",
        hasInternet:false,
        showKeyboard:false,
        layoutName: "default",
        showPassState: "password"
    }

    getConnections = () =>
    {
        var _ssids = []
        const getSsids = async() =>{
        await fetch("http://localhost:3011/getWifiAps")
        .then(res => res.json())
        .then(
            (result) =>{
                var aps = result.accessPoints
                //console.log(aps.length);

                for(var i = 0; i < aps.length; i++){
                    var ssid = aps[i].ssid;
                    

                    this.state.ssidList.push(<option value={ssid}>{ssid}</option>)
                }
                this.setState({statusText:"Waiting For Selection"})
               
            }
        )
        }

        getSsids();

    }
    ssidSelected = (event) =>{
        //console.log("setting selected ssid ",event.target.value)
        this.setState({selectSsid:event.target.value})
    }
    passChanged = (event) =>{
        //console.log("GOT PASSWORD: ",event.target.value)
        this.setState({selectPassword:event.target.value});
        this.keyboard.setInput(this.state.selectPassword);
    }

    ConnectWifi = () =>{
        this.setState({statusText:"Attempting To Connect to " + this.state.selectSsid});
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                ssid:this.state.selectSsid,
                password:this.state.selectPassword
            })
        }

        fetch('http://localhost:3011/connectAp',requestOptions)
        .then(res => res.json())
        .then(
            (result)=>{
                //console.log(result)
                if(result.success){
                    this.setState({statusText:"Connected To " + this.state.selectSsid + "!"})
                }else{
                    this.setState({statusText:"Could Not Connect To " + this.state.selectSsid})
                }
            },
            (error) =>{
                //console.log(error)
            }
        )
    }
    ConnectAnyway =() =>{
        this.setState({hasInternet:false})
       
    }

    pwInputSelected = () =>{
        //console.log("Selected PW Input")
        this.setState({showKeyboard:true})
    }
    pwInputDeselected = () =>{
        //console.log("Deselect pw input")
        
    }
    onChange = (input) => {
        //console.log("setting pw",input);
        this.setState({selectPassword:input})
    }
    showPassword = () =>{
      
        const pwState = this.state.showPassState
        //console.log(pwState)
        this.setState({showPassState: pwState === "text" ? "password" : "text"})
    }
    onKeyPress = (button) => {
        if (button === "{shift}" || button === "{lock}") this.handleShift();
        else this.setState({layoutName:"default"});
    }
    handleShift = () =>{
        const layoutName = this.state.layoutName;

        this.setState({
            layoutName: layoutName === "default" ? "shift" : "default"
        })
    }
    componentDidMount = () =>{
      //console.log("WIFI POP SHOWN")
      
      this.state.ssidList.push(<option value={"Select Wifi Connection"}>Select WiFi Connection</option>)
      this.setState({hasInternet:this.props.hasInternet})
      this.getConnections()
    }

    renderConnect = () => {
        return(
            <div className="modalz">
            <div className="modal_content">
                <div className="modalTopBar">
                    <div className="modalTitlez"><div className="titletext">Connect To A WiFi Access Point</div></div>
                <div className="exitButtonz" onClick={this.handleClick}><div style={{display:"table-cell",verticalAlign:"middle",fontSize:"30px",fontWeight:"bold"}}>&times;</div></div>
                </div>
                <div className="statusInd">{this.state.statusText}</div>
                <form className="wifiForm">
                <label className="formLabel">WiFi Access Point Name:</label>
                <select className="ssidDropdown" size="5" id="selectbox" value={this.state.selectSsid} onChange={this.ssidSelected}>            
                {this.state.ssidList}
                </select>
                <label className="formLabel">Password:</label>
                <input className="passwordInput" type={this.state.showPassState} name="password" value={this.state.selectPassword} onChange={this.passChanged} onSelect={this.pwInputSelected} onBlur={this.pwInputDeselected}></input>
                <label className="formLabel">Show Password:</label>
                <input className="showPass" type="radio" checked={this.state.showPassState ==="text"} onClick={this.showPassword}></input>
                </form>
                <button className="connectButton" onClick ={this.ConnectWifi}>Connect</button>
             
            </div>
            <div style={{color:'black'}}>
            {this.state.showKeyboard ? <Keyboard 
                        keyboardRef={r => (this.keyboard = r)}
                        layoutName={this.state.layoutName}
                        onChange={this.onChange}
                        onKeyPress={this.onKeyPress}/> : null}
            </div>
        </div>
        );
    }
    renderAlready = () =>{
        return(
            <div className="modalz" >
            <div className="modal_content">
                <div className="modalTopBar">
                    <div className="modalTitlez"><div className="titletext">Connect To A WiFi Access Point</div></div>
                <div className="exitButtonz" onClick={this.handleClick}><div style={{display:"table-cell",verticalAlign:"middle",fontSize:"30px",fontWeight:"bold"}}>&times;</div></div>
                </div>
                <div className="statusInd">Already Connected!</div>
                <button className="connectButton" style = {{width:'40%'}} onClick ={this.ConnectAnyway}>New Connection</button>
            </div>
            
        </div>
        );
    }

    renderContent = () =>{
        if(this.state.hasInternet){
            return this.renderAlready();
        }else{
            return this.renderConnect();
        }
    }
    render(){
        return(
         <>
          {this.renderContent()}
          </>
        );
    }
}