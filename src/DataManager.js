export default class DataManager{

    static primaryInstance = null;
    static secondaryInstance = null;

    static getInstance(){
        if(DataManager.primaryInstance == null)
        {
            DataManager.primaryInstance = new DataManager();
            
        }

        return DataManager.primaryInstance;
    }
    getStateData()
    {
        return this.loopState;
    }
    getFlowData()
    {
        return this.flowData;
    }

    getVolumetricData()
    {
        return this.volData;
    }

    getSecondaryData()
    {
        return this.secData;
    }
    getAllData()
    {
        let concat = {
            loopState: this.loopState,
            flowData : this.flowData,
            volData :this.volData,
            secData : this.secData
        };
        return concat;
    }

    OnPoll(_cb){
        this.pollCallbacks.push(_cb);
    }

    OnRunningChange(_cb){
        this.runningCallbacks.push(_cb);
    }

    assertRunning(old,_new){
        if(old != _new)
        {
            for(var i = 0; i < this.runningCallbacks.length; i++)
            {
                this.runningCallbacks[i](_new);
            }
        }
    }
    getPythonData(){
        fetch("http://localhost:3005/getState")
        .then(res => res.json())
        .then(
            (result) =>{
            
            //console.log(result);
         
            this.loopState.flowOs = result.state.flowOs;
            this.loopState.running = result.state.loopRunning;
            this.loopState.serialNum = result.state.serialNum;
            this.loopState.volOs = result.state.volOs;
            this.loopState.volSecDerived = result.state.volSecDerived;
            
            
            this.flowData.instFlow = result.instantFlow;
            this.flowData.setPoint = result.setPoint;
            var _avg = result.avgFlow;
            if(Math.abs(_avg - result.setPoint) < result.setPoint * 0.06)
            {
                _avg = result.setPoint;
            }
            this.flowData.avgFlow = _avg;
            this.flowData.volume = result.volume;
            
            this.secData.reading = result.secVal;
            this.secData.unit = result.secUnit;
            this.secData.setPoint = result.secSetPoint;
            this.secData.extraData = result.secondaryExtra;
            this.secData.available = result.secAvailable;

            this.volData.reading = result.volSecReading;
            this.volData.setpoint = result.volSetPoint;
            this.volData.unit = result.volUnits;
            this.volData.available = result.volumeAvailable;
            },
            (error) => {console.log(error)}
        )
        this.assertRunning(this.running,this.loopState.running);
        this.running = this.loopState.running;
        this.sendPollEvent();
    }

    sendPollEvent(){
        for(var i=0;i<this.pollCallbacks.length;i++){
            this.pollCallbacks[i]();
        }
    }
    constructor()
    {
        this.loopState = {
            flowOs:0,
            running:false,
            serialNum:"N/A",
            volOs:"1",
            volSecDerived:false
        };
    
        this.flowData = {
            instFlow:0,
            avgFlow:0,
            volume:0,
            setPoint:0
        }
    
        this.secData = {
            reading:0,
            unit:"null",
            setPoint:0,
            extraData:[],
            available: false
        }
    
        this.volData = {
            reading:0,
            unit:"null",
            setPoint:0,
            available: false
        }

        this.pollCallbacks = [];
        this.runningCallbacks = [];
        this.running = false;
        //console.log("constructing",this);
        this.getPythonData = this.getPythonData.bind(this);
        setInterval(this.getPythonData,100);
    }

}