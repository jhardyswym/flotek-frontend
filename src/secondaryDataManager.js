import { SecondarySelections } from "./secondaries";

export default class SecondaryDataManager {
    static myInstance = null;

    sensorParams = {
        sensorType : SecondarySelections[0],
        unit : "",
        channel: 0,
        limit: 0.0,
        reading: 0.0,
      
    };
    volParams = {
        sensorType : SecondarySelections[0],
        unit : "",
        channel: 0,
        limit: 0.0,
        reading: 0.0,
    
    };
    volAvailable = false;
    static getInstance(){
        if(SecondaryDataManager.myInstance == null){
            SecondaryDataManager.myInstance = new SecondaryDataManager();
        }

        return this.myInstance;
    }

    getParams(){
        return this.sensorParams;
    }
    getVolParams()
    {
        return this.volParams;
    }
    setReading(reading){
        this.sensorParams.reading = reading;
    }
    getReading(){
      fetch('http://localhost:3005/hmiData')
      .then(response => response.json())
      .then(parsedResponse =>{
            this.sensorParams.reading = parsedResponse.secVal;
      },
      (error)=>{
          
      })
        return this.sensorParams.reading;
    }

    getVolReading(){
        fetch('http://localhost:3005/hmiData')
        .then(response => response.json())
        .then(parsedResponse =>{
              this.volParams.reading = parsedResponse.volSecReading;
        },
        (error)=>{
            
        })
          return this.volParams.reading;
      }
  
    getSecLimit(){
        fetch('http://localhost:3005/hmiData')
        .then(response => response.json())
        .then(parsedResponse =>{
              this.sensorParams.limit = parsedResponse.secSetPoint;
              
        },
        (error)=>{
            
        })
          return this.sensorParams.limit;
      }
    getVolLimit(){
        fetch('http://localhost:3005/hmiData')
        .then(response => response.json())
        .then(parsedResponse =>{
              this.volParams.limit = parsedResponse.volSetPoint;
              
        },
        (error)=>{
            
        })
          return this.volParams.limit;
    }
    setParams(_type,_units,_channel,_limit){

        //console.log("Setting Data Manager: ",_type,_units,_channel,_limit);
        this.sensorParams.sensorType = _type;
        this.sensorParams.unit = _units;
        this.sensorParams.channel = _channel;
        this.sensorParams.limit = _limit
    }
    setVolParams(_type,_units,_channel,_limit){

        //console.log("Setting Data Manager: ",_type,_units,_channel,_limit);
        this.volParams.sensorType = _type;
        this.volParams.unit = _units;
        this.volParams.channel = _channel;
        this.volParams.limit = _limit
    }
    getVolumeUnits()
    {
        if(this.volAvailable) return this.volParams.unit;
        else return "mL";
    }
    async sensorAvailable()
    {
        var avail = false;
        await fetch('http://localhost:3005/secondaryAvailable')
        .then(response => response.json())
        .then(res =>{
            avail = res.available;
           
            
        })
        .catch(err =>{avail = false})

        return avail;

        
    }

    async volumetricAvailable()
    {
        var avail = false;
        await fetch('http://localhost:3005/volumetricAvailable')
        .then(response => response.json())
        .then(res =>{
            avail = res.available;
           
            
        })
        .catch(err =>{avail = false})
        this.volAvailable = avail;
        return avail;

        
    }
    setLimit(lim){
        this.sensorParams.limit = lim;
        this.sendBackendUpdate();
    }
    setVolLimit(lim){
        this.volParams.limit = lim;
        this.sendVolBackendUpdate();
    }
    sendBackendUpdate(){
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                type:this.sensorParams.sensorType.int_name,
                unit:this.sensorParams.unit,
                limit:this.sensorParams.limit,
                channel:this.sensorParams.channel
            })
        }

        fetch('http://localhost:3005/updateSecParams',requestOptions)
        .then(res => res.json())
        .then(
            (result)=>{
                //console.log(result)
            },
            (error) =>{
                //console.log(error)
            }
        )
    }
    sendVolBackendUpdate(){
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                type:this.volParams.sensorType.int_name,
                unit:this.volParams.unit,
                limit:this.volParams.limit,
                channel:this.volParams.channel
            })
        }

        fetch('http://localhost:3005/updateVolParams',requestOptions)
        .then(res => res.json())
        .then(
            (result)=>{
                //console.log(result)
            },
            (error) =>{
                //console.log(error)
            }
        )
    }
};