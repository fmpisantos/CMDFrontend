import React, { Component } from 'react';
import { sha3_512 } from 'js-sha3';
import './Cmd.css';
import FileEdit from "./FileEdit";

class Cmd extends Component {

  constructor(props){
    super(props);
    this.state = {
      input: "",
      responses: [],
      dir: "",
      fileName: "",
      file: "",
      flag: true,
      requests: [""],
      request: 0,
      logged : false,
      password : "" 
    }
    this.sendQuery = this.sendQuery.bind(this);
    this.inputKey = this.inputKey.bind(this);
    this.onChange = this.onChange.bind(this);
    this.inputBlur = this.inputBlur.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.makeRequest = this.makeRequest.bind(this);
  }

  componentDidMount(){
    //getStart
    fetch(this.props.url+"/getstart",{
      method : "POST",
      mode: 'cors',
      body: JSON.stringify({email: sessionStorage.getItem("email"),tokenID: sessionStorage.getItem("tokenID")})
    }).then(function(response) {
      if (!response.ok) {
          throw Error(response.statusText);
      }
      return response;
    }).then((response)=>{
        response.json().then((text)=>{
          if(text.Error){
            this.changeSessionStorage("","");
            this.error();
          }else
            this.setState({dir:text.dir.trim(),logged:true})
        })
      }).catch((err)=>{
        this.setState({input:""})
        console.log(err)
      })
  }

  inputKey(e){
    if(13 === e.keyCode){
      if(this.state.logged){
        this.sendQuery();
        this.setState({request:0})
      }else{
        this.login.bind(this)()
      }
    }else if(38 === e.keyCode){
      var val = this.state.requests.length-1;
      if(this.state.request === 0){
      this.setState({request: val,input:this.state.requests[val]})
      }else{
        this.setState({request:this.state.request-1,input: this.state.requests[this.state.request-1]})
      }
    }else if(40 === e.keyCode){
      var val = this.state.requests.length-1;
      if(this.state.request === val){
      this.setState({request: 0,input:this.state.requests[0]})
      }else{
        this.setState({request:this.state.request+1,input: this.state.requests[this.state.request+1]})
      }
    }
  }

  onChange(e){
    if(this.state.logged)
      this.setState({input: e.target.value})
    else{
      let pass = "";
      for(let i = 0 ;i<e.target.value.length;i++)
        pass += "*";
      if(this.state.password.length<=e.target.value.length)
        var pp = this.state.password+e.target.value.charAt(e.target.value.length-1)
      else
        var pp = this.state.password.substring(0,this.state.password.length-1);
      this.setState({input:pass,password:pp})
    }
  }

  checkIfLogged(){
    var tokenID = sessionStorage.getItem("tokenID");
    var email = sessionStorage.getItem("email");
    return email !== "" && tokenID !== "";
  }

  changeSessionStorage(email,tokenID){
    sessionStorage.setItem("email",email);
    sessionStorage.setItem("tokenID",tokenID);
  }

  sendQuery(){
    //Query
    if(this.state.logged)
    if(this.state.input.startsWith("edit ")){
      let arrResponse = this.state.responses;
      arrResponse.push(this.state.dir+" > "+this.state.input);
      let arrRequests = this.state.requests;
      arrRequests.push(this.state.input)
      fetch(this.props.url+"/openfile",{
        method : "POST",
        mode: 'cors',
        body: JSON.stringify({fileName: this.state.input.split("edit ")[1],dir:this.state.dir, email : sessionStorage.getItem("email"),tokenID: sessionStorage.getItem("tokenID")})
      }).then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
      }).then((response)=>{
          response.json().then((text)=>{
            if(text.Error){
              this.changeSessionStorage("","");
              this.error();
            }else
              this.setState({file:text.file,fileName:text.fileName,dir:text.dir.trim(),flag:false,resposes:arrResponse,input:"",requests:arrRequests})
          })
        }).catch((err)=>{
          this.setState({input:""})
          console.log(err)
        })
    }else{
      this.sendRequest(this.makeRequest());
      var objDiv = document.getElementById("cmd");
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  }

  login(){
    // Will have to ask for email to get more security
    sessionStorage.setItem("email","filipesantos.sporting@gmail.com");
    fetch(this.props.url+"/login",{
      method : "POST",
      mode: 'cors',
      body: JSON.stringify({email: sessionStorage.getItem("email"),password: sha3_512(this.state.password)})
    }).then(function(response) {
      if (!response.ok) {
          throw Error(response.statusText);
      }
      return response;
    }).then((response)=>{
        response.json().then((text)=>{
          if(text.Error){
            this.changeSessionStorage("","");
            this.error();
          }else{
            this.setState({responses:[],input:"",requests:[],dir:text.dir,request:0,logged:true, password : ""})
            sessionStorage.setItem("tokenID", text.tokenID)
          }
        })
      }).catch(error=>console.log(error))
  }

  makeRequest(){
    return {
      request: this.state.input,
      dir: this.state.dir,
      email : sessionStorage.getItem("email"),
      tokenID: sessionStorage.getItem("tokenID")
    }
  }

  sendRequest(req){
    if(req.request !== ""){
      if(req.request === "restart"){
        let arrRequests = this.state.requests;
        arrRequests.push(this.state.input);
        this.setState({responses:[],input:"",requests:arrRequests,request:0,dir:"/mnt/c/Users/pipas/Desktop"})
      }else if(req.request === "clear" || req.request === "cls"){
        let arrRequests = this.state.requests;
        arrRequests.push(this.state.input);
        this.setState({responses:[],input:"",requests:arrRequests,request:0})
      }else{
      let arrResponse = this.state.responses;
      arrResponse.push(this.state.dir+" > "+this.state.input);
      let arrRequests = this.state.requests;
      arrRequests.push(this.state.input);
      fetch(this.props.url+"/runcmd",{
        method : "POST",
        mode: 'cors',
        body: JSON.stringify(req)
      }).then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
      }).then((response)=>{
          response.json().then((text)=>{
            if(text.Error){
              this.changeSessionStorage("","");
              this.error();
            }else if(text.response.trim()!="")
              arrResponse.push(text.response)
              this.setState({responses: arrResponse,input:"",dir:text.dir.trim(),requests:arrRequests},()=>{
                var objDiv = document.getElementById("cmd");
                objDiv.scrollTop = objDiv.scrollHeight;
              });
            })
          }).catch((err)=>{
            this.setState({input:""})
            console.log(err)
          })
      }
    }
  }

  inputBlur(e){
    e.currentTarget.focus();
    e.preventDefault();
  }

  changeComp(){
    console.log("here")
    this.setState({flag:!this.state.flag});
  }
  
  error(){
    let arrRequests = this.state.requests;
    arrRequests.push(this.state.input);
    this.setState({responses:[],input:"",requests:arrRequests,request:0,logged:false, password : ""})
  }

  render() {
    return (
      <div>
        {this.state.logged?(
          this.state.flag?( <div className="cmd" id="cmd">
          {
            this.state.responses.map((item,id)=>{
              return(
                <div key={id}>
                    <small className="span">{item.trim()}</small>
                  <br/>
                </div>
              )
            })
          }
          <div style={{float:"left",width:"98vh"}}>
                <small className="" >{this.state.dir+" > "}</small><input autoComplete="off" onBlur={this.inputBlur} autoFocus value={this.state.input} onChange={this.onChange} onKeyDown={this.inputKey} style={{width: "70vh"}} className="cmd" id="cmdInput"></input>
        </div>
      </div>):(<FileEdit error={this.error.bind(this)} url={this.props.url} changeComp={this.changeComp.bind(this)} dir={this.state.dir} fileName={this.state.fileName} file={this.state.file}></FileEdit>)
        ):(
        <div className="cmd" id="cmd">
          <div style={{float:"left",width:"98vh"}}>
                <small className="" >{"Enter Password > "}</small><input autoComplete="off" onBlur={this.inputBlur} autoFocus value={this.state.input} onChange={this.onChange} onKeyDown={this.inputKey} style={{width: "70vh"}} className="cmd" id="password"></input>
        </div>
        </div>          
          )}
        
      </div>
    );
  }
}

export default Cmd;
