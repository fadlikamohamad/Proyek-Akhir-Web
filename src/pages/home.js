import React, { Component } from 'react';
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
        this.setState({
          result: response.result,
          isLoading: false
        });
      });
  }

  render() {
    const {
      currentFile,
      previewImage,
      result,
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
                  <img className="preview" src={previewImage} alt="" />
                </div>
                )}

                {result && (
                <div className="alert alert-secondary mt-3" role="alert">
                  {result}
                </div> 
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;