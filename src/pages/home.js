import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ApexChart from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Card from 'react-bootstrap/Card';

class Home extends Component {
  constructor(props) {
    super(props);
    this.selectFile = this.selectFile.bind(this);
    this.predict = this.predict.bind(this);

    this.state = {
      currentFile: undefined,
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
  }

  selectFile(event) {
    this.setState({
      currentFile: event.target.files[0],
      previewImage: URL.createObjectURL(event.target.files[0]),
    });
  }

  predict() {
    const file = this.state.currentFile;

    const data = new FormData();
    data.append('file', file);

    this.setState({ isLoading: true });
    
    fetch('http://127.0.0.1:5000/prediction/', 
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
      });
  }

  render() {
    const {
      currentFile,
      previewImage,
      result,
      series,
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
                      <input type="file" accept="image/*" onChange={this.selectFile} />
                    </label>
                  </div>

                  <div className="col-4">
                    <button
                      className="btn btn-success btn-sm"
                      disabled={!currentFile}
                      onClick={this.predict}
                    >
                      Predict
                    </button>
                  </div>
                </div>

                {previewImage && (
                <div>
                  <img className="preview" src={previewImage} alt="" width="100" height="100"/>
                </div>
                )}

                {result && (
                <div className="alert alert-secondary mt-3" role="alert">
                  {result}
                </div> 
                )}
              </div>
            </div>
            {series && (
              <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="pie" width={380}/>
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