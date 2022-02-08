import React from 'react';
import './components.css';
import Plot from 'react-plotly.js'
import GraphBuffer from './graphBuffer';
import SecondaryDataManager from './secondaryDataManager'
import UIController from './uIController';
import DataManager from './DataManager';
const Influx = require('influx');
const bodyParser = require('body-parser');
var dateTime = require('node-datetime');

const rmbuttons =   ['lasso2d',
 'select2d',
 'sendDataToCloud',
 'zoom2d',
 'pan2d',
 'zoomIn2d',
 'zoomOut2d',
 'autoScale2d',
 'resetScale2d',
 'hoverClosestCartesian',
 'hoverCompareCartesian',
 'zoom3d',
 'pan3d',
 'orbitRotation',
 'tableRotation',
 'resetCameraDefault3d',
 'resetCameraLastSave3d',
 'hoverClosest3d',
 'zoomInGeo',
 'zoomOutGeo',
 'resetGeo',
 'hoverClosestGeo',
 'hoverClosestGl2d',
 'hoverClosestPie',
 'toggleHover',
 'toImage',
 'resetViews',
 'toggleSpikelines']

export default class InfluxGraph extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = 
    {
      gdata:new GraphBuffer(10 * 60 * 10,100),
      data:[],
      layout:0,
      timeStr:'five',
      graphTimeRatio:0.5,
      graphRunning:true
    }

   //setInterval(this.getPointsopt,50);
  }

    SetTimeFrame = (frame) => {
      console.log("setting timeframe",frame);
      this.setState({graphTimeRatio:(frame/10)});

    }


    getPointsopt = () =>{
      var startTime = performance.now()

      const url = 'http://localhost:3005/hmiData';
 
      let res = DataManager.getInstance().getAllData();
      this.state.gdata.addPoint(res.flowData.instFlow,res.flowData.avgFlow,res.secData.unit,res.secData.reading,res.flowData.setPoint,res.flowData.volume,res.secData.extraData,res.volData.reading);
    

      var points = this.state.gdata.getPoints(this.state.graphTimeRatio);
      
      let aflow_arr = points[0]
      let sval_arr = points[3]
      let sp_arr =  points[2]
      let ts_arr = points[5]
      let os_arr = points[6]
      let vscale_arr = points[4];
      var ed_tr = points[7];
      var _ed_len = points[7].length;
      var ed_traces = [];
      //console.log(_ed_len)
      // for(var i = 0; i < _ed_len; i++)
      // {
      //   ed_traces.push({
      //     type: "scatter",
      //     mode: "lines",
      //     x: ts_arr,
      //     y: ed_tr[i],
      //     line: {width:1}
      //   })
      // }

      const flowTrace = {
        type: "scatter",
        mode: "lines",
        x: ts_arr,
        y: aflow_arr,
        line: {color: '#3963DB',width:3}
      }

      const osTrace = {
        type: "scatter",
        mode: "lines",
        x: ts_arr,
        y: os_arr,
        line: {color:"#8D8D8D"}
      }
      const os2Trace = {
        type: "scatter",
        mode: "lines",
        x: ts_arr,
        y: os_arr,
        line: {color:"#8D8D8D"},
        yaxis:'y2'
      }
      const avgTrace = {
        type: "scatter",
        mode: "lines",
        x: ts_arr,
        y: aflow_arr,
        line: {color:"#3ed5f0"}
      }

      const spTrace = {
        type: "scatter",
        mode: "lines",
        x: ts_arr,
        y: sp_arr,
        line: {color:"#f7584d",width:5}
      }

      const secValTrace = {
        type: "scatter",
        mode: "lines",
        x: ts_arr,
        y: sval_arr,
        line: {color:'#f5b042',width:3},
        yaxis:'y2'
      }
      const svOffsetTrace = {
        type: "scatter",
        mode: "lines",
        x: ts_arr,
        y: os_arr,
        line: {color:"#8D8D8D"},
        yaxis:'y2'
      }

      const vscaleTrace = {
        type: "scatter",
        mode: "lines",
        x: ts_arr,
        y: vscale_arr,
        line: {color:'#11bf60',width:3},
        yaxis:'y2'
      }
      const _d = ed_traces;
      
      const data = [spTrace,avgTrace,flowTrace,secValTrace,svOffsetTrace,vscaleTrace,osTrace,os2Trace]
      
      //console.log(data[3].y[2999]);
      const layout = {
        height:window.innerHeight * 0.9,
        showlegend:false,
        yaxis:{
          title:'ml/min'
        },
        yaxis2: {
          overlaying:'y',
          side:'right',
          title: SecondaryDataManager.getInstance().getParams().unit,
        },
        
        margin:{    
          t: 25,
          l: 25
         }
        
      };
      
      if(this.state.graphRunning){
        //console.log('setstate')
        this.setState({layout:layout,data:data});
      }
      var endtime = performance.now()
      //console.log(endtime - startTime)
    }
  

    stopGraphDelayed = () =>{
      console.log("Stopping Graph");
      this.setState({graphRunning:false});
    }

    ssButtonAssert = (start) =>{
      //console.log("asser start",start)
   
        this.setState({graphRunning:start});

      
      
      
    }
    componentDidMount =() =>{
      UIController.getInstance().addStopStartCallback(this.ssButtonAssert);
      DataManager.getInstance().OnPoll(this.getPointsopt);
      DataManager.getInstance().OnRunningChange(this.ssButtonAssert);
      //Start w/ graph running to have it formatted correctly.
      //setTimeout(this.stopGraphDelayed,2000);
    }
    render()
    {
      

      return(
        <div className="graphContainer">
          <div className="graph">
            <Plot 
                  data = {this.state.data}
                  layout = {this.state.layout}
                  config={{displayModeBar:false,modeBarButtonsToRemove:rmbuttons,responsive:true}}
                  style={{bottom:'10%',right:'10%'}}
              />
          </div>

          <div className = "tfContainer">
                    {this.state.graphTimeRatio === 1&&
                        <div>
                        <button className="timeFrameButton" onClick={() => {this.SetTimeFrame(1)}}>1 Minute</button>
                        <button className="timeFrameButton" onClick={() => {this.SetTimeFrame(5)}}>5 Minutes</button>
                        <button className="timeFrameButtonF" onClick={() => {this.SetTimeFrame(10)}}>10 Minutes</button>
                        </div>
                    }

                    {this.state.graphTimeRatio === 0.5 &&
                        <div>
                        <button className="timeFrameButton" onClick={() => {this.SetTimeFrame(1)}}>1 Minute</button>
                        <button className="timeFrameButtonF" onClick={() => {this.SetTimeFrame(5)}}>5 Minutes</button>
                        <button className="timeFrameButton" onClick={() => {this.SetTimeFrame(10)}}>10 Minutes</button>
                        </div>
                    }

                    {this.state.graphTimeRatio === 0.1 &&
                        <div>
                        <button className="timeFrameButtonF" onClick={() => {this.SetTimeFrame(1)}}>1 Minute</button>
                        <button className="timeFrameButton" onClick={() => {this.SetTimeFrame(5)}}>5 Minutes</button>
                        <button className="timeFrameButton" onClick={() => {this.SetTimeFrame(10)}}>10 Minutes</button>
                        </div>
                    }

                </div>
        </div>
        );
    }


}