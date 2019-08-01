import React, { Component } from 'react';
import './Cmd.css';

class FileEdit extends Component {
constructor(props){
    super(props);
    this.state = {
        dir : this.props.dir,
        fileName : this.props.fileName,
        file: this.props.file
    }
}

  saveFile(){
    fetch(this.props.url+"/savefile",{
        method : "POST",
        mode: 'cors',
        body: JSON.stringify({fileName:this.state.fileName,dir:this.state.dir,file : document.getElementById("form10").value,email : sessionStorage.getItem("email"),tokenID: sessionStorage.getItem("tokenID")})
      }).then((response)=>{
          response.json().then((text)=>{
            if(text.Error){
                this.changeSessionStorage("","");
                this.props.error();
            }else                
                this.props.changeComp();
          })
    })
  }

  render() {
    return (
        <div >
            <div className="container">
                <div className="row">
                    <div className="col-6">
                        <small>{this.state.dir+"\\"+this.state.fileName}</small>
                    </div>
                    <div className="col-6">
                        <button onClick={this.saveFile.bind(this)} type="button" className="btn btn-secondary">Save</button>
                    </div>
                </div>

            </div>
            <br/>
            <textarea id="form10" style={{height:"80vh"}} className="md-textarea form-control" rows="3" defaultValue={this.state.file}></textarea>
        </div>
    );
  }
}

export default FileEdit;
