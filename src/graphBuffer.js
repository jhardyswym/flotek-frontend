

export default class GraphBuffer {

    constructor(data_len,d_time){
        this.length = data_len;
        this.d_time = d_time;
        this.data = new Array(data_len);
        this.flow = new Array(data_len).fill(0);
        this.volume = new Array(data_len).fill(0);
        this.setpoint = new Array(data_len).fill(0);
        this.secondary = new Array(data_len).fill(0);
        this.volumetric = new Array(data_len).fill(0);
        this.time = new Array(data_len).fill(0);
        this.extraData = new Array(data_len).fill(0);
        this.os = new Array(data_len).fill(0);
        this.datarr = [];
        this.initData();
    }

    initData(){
        var timeBuf = new Date().valueOf() - this.d_time * this.length;

        for(var i = 0; i < this.length; i++)
        {
            this.time[i] = new Date(timeBuf);
            this.data[i] = {
                        flow:0,
                        avgFlow: 0,
                        secUnit: "",
                        secVal: 0,
                        setPoint: 0,
                        volume: 0,
                        offset: 0,
                        timeStamp: new Date(timeBuf),
                        extraData:[],
                        extraDataLen:0,
                        volread:0
                        }
            timeBuf += this.d_time;
        }
    }
    addPoint(flow,aflow,sunit,sval,spoint,volume,exd,volReading){
        this.data.shift();
        
        this.data.push({
            flow:flow,
            avgFlow:aflow,
            secUnit:sunit,
            secVal:sval,
            setPoint:spoint,
            volume:volume,
            offset: 0,
            extraData: exd,
            extraDataLen: exd.length,
            timeStamp:new Date(),
            volread:volReading
        })

        this.flow.shift();
        this.volume.shift();
        this.setpoint.shift();
        this.secondary.shift();
        this.volumetric.shift();
        this.time.shift();
        this.extraData.shift();
        
        this.flow.push(aflow);
        this.volume.push(volume);
        this.setpoint.push(spoint);
        this.secondary.push(sval);
        this.volumetric.push(volReading);
        this.time.push(new Date());
        this.extraData.push(exd);
        
        this.datarr = [this.flow,this.volume,this.setpoint,this.secondary,this.volumetric,this.time,this.os,this.extraData];
    }

    getPoints(ratio){
        let startPoint = this.length - this.length * ratio;

        for(var i = 0 ; i < this.datarr.length; i++)
        {
            this.datarr[i] = this.datarr[i].slice(startPoint);
        }

        return this.datarr;
    }
    getData(ratio){
        let startPoint = this.length - this.length * ratio;

        return this.data.slice(startPoint);
    }



}