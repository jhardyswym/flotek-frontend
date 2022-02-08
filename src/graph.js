import React from 'react';
import './components.css';
import { InfluxDB } from "@influxdata/influxdb-client";
export default class GraphContainer extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            //10.10.0.121
            //10.0.0.37
            graphEmbedUrl : "http://localhost:3000/d-solo/cgKoJuHGz/flotekguirev1?orgId=1&refresh=500ms&from=now-10m&to=now&panelId=4",
            timeState : "10m",
        }
        //this.graphEmbedUrl = "http://localhost:3000/d-solo/cgKoJuHGz/flotekguirev1?orgId=1&refresh=100ms&from=now-10m&to=now&panelId=4";
        this.SetTimeFrame = this.SetTimeFrame.bind(this);
    }
    SetTimeFrame(_timeFrame)
    {
        //this.timeFrame = _timeFrame;
        var _url = "http://localhost:3000/d-solo/cgKoJuHGz/flotekguirev1?orgId=1&refresh=500ms&from=now-" + _timeFrame +"&to=now&panelId=4"
       // //console.log(_url);
       //this.graphEmbedUrl = _url;
        //this.setState({graphEmbedUrl : _url})
        this.setState({graphEmbedUrl : _url});
        this.setState({timeState:_timeFrame})
    }
    render()
    {
        return(
            <div className="graphContainer">
                <div className="graph">
                    <iframe src={this.state.graphEmbedUrl} className="grafanaEmbed"></iframe>
                </div>
                <div className = "tfContainer">
                    {this.state.timeState === "10m"&&
                        <div>
                        <button className="timeFrameButton" onClick={() => {this.SetTimeFrame("1m")}}>1 Minute</button>
                        <button className="timeFrameButton" onClick={() => {this.SetTimeFrame("5m")}}>5 Minutes</button>
                        <button className="timeFrameButtonF" onClick={() => {this.SetTimeFrame("10m")}}>10 Minutes</button>
                        </div>
                    }

                    {this.state.timeState === "5m"&&
                        <div>
                        <button className="timeFrameButton" onClick={() => {this.SetTimeFrame("1m")}}>1 Minute</button>
                        <button className="timeFrameButtonF" onClick={() => {this.SetTimeFrame("5m")}}>5 Minutes</button>
                        <button className="timeFrameButton" onClick={() => {this.SetTimeFrame("10m")}}>10 Minutes</button>
                        </div>
                    }

                    {this.state.timeState === "1m"&&
                        <div>
                        <button className="timeFrameButtonF" onClick={() => {this.SetTimeFrame("1m")}}>1 Minute</button>
                        <button className="timeFrameButton" onClick={() => {this.SetTimeFrame("5m")}}>5 Minutes</button>
                        <button className="timeFrameButton" onClick={() => {this.SetTimeFrame("10m")}}>10 Minutes</button>
                        </div>
                    }

                </div>
            </div>
        );
    }
}
