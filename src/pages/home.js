import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ApexChart from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Card from 'react-bootstrap/Card';
import {ThreeDots} from 'react-loader-spinner';

class Home extends Component {
  constructor(props) {
    super(props);
    this.selectFile = this.selectFile.bind(this);
    this.predict = this.predict.bind(this);

    this.initialState = {
      currentFile: null,
      fileName: "",
      tempCurrentFile: null,
      previewImage: undefined,
      result: "",
      isLoading: false,
      series: undefined,
      options: {
        chart: {
          width: 380,
          type: 'pie',
        },
        labels: [],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
    };
    this.state = this.initialState;
  }

  selectFile(event) {
    if (event.target.files.length > 0) {  
      this.setState({
        currentFile: event.target.files[0],
        fileName: event.target.files[0].name,
        previewImage: URL.createObjectURL(event.target.files[0]),
        tempCurrentFile: event.target.files[0],
      });
    } else {
      this.setState({
        currentFile: this.state.tempCurrentFile,
      });
    }
  }

  predict() {
    const file = this.state.currentFile;

    const data = new FormData();
    data.append('file', file);

    this.setState({ isLoading: true });
    
    fetch('http://192.168.56.142:5000/prediction/', 
      {
        method: 'POST',
        body: data
      })
      .then(response => response.json())
      .then(response => {
        console.log(response)
        var options = {...this.state.options}
        options.labels = [response.result[0].class, response.result[1].class]
        this.setState({
          result: response.result[2].predicted_label,
          series: [response.result[0].score, response.result[1].score],
          options,
          isLoading: false
        });
      })
      .catch(err => {
        console.log(err)
        this.setState({
          result: "Server sedang bermasalah. Silahkan coba beberapa saat lagi.",
          isLoading: false
        });
      });
  }

  onResetClick(e) {
    e.preventDefault();
    this.setState(this.initialState);
    document.getElementById("input").value = null;
  }

  render() {
    const {
      currentFile,
      previewImage,
      result,
      series,
      isLoading
    } = this.state;

    return (
      
      <div className="container">
        <div class="card bg-light">
          <div class="card-body text-center">
            <h4>Skin Cancer Detection</h4>
            <div className="content">
              <div>
                <div className="row">
                  <div className="col-8">
                    <label className="btn btn-default p-0">
                      <input id="input" type="file" title=" " accept="image/*" onChange={this.selectFile}/>
                    </label>
                  </div>

                  <div className="col-4">
                    <button
                      className="btn btn-success btn-sm"
                      style={{marginRight: 5 + 'px'}}
                      disabled={!currentFile}
                      onClick={this.predict}
                    >
                      Predict
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      disabled={!currentFile} 
                      onClick={this.onResetClick.bind(this)}
                    >
                      Reset
                    </button>
                  </div>
                </div>
                {previewImage && (
                  <div>
                    <img className="preview" src={previewImage} alt="" width="100" height="100"/>
                    <p>{this.state.fileName}</p>
                  </div>
                )}
                {isLoading ? <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}><ThreeDots/></div> : null}
                {result && (
                  <div className="alert alert-secondary mt-3" role="alert">
                    {result}
                  </div> 
                )}
              </div>
            </div>
            {series && (
              <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="pie" width={350}/>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
// const domContainer = document.querySelector('#chart');
// ReactDOM.render(React.createElement(ApexChart), domContainer);
export default Home;