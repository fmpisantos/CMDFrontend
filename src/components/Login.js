import React, { Component } from 'react';
import './Cmd.css';
import $ from "jquery"
import shake256 from "js-sha3"

class FileEdit extends Component {
constructor(props){
    super(props);
    this.state = {
        email : "",
        password : ""
    }
}

  componentDidMount(){
      
(function ($) {
    "use strict";


    /*==================================================================
    [ Focus Contact2 ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })
  
  
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    

});
  }

  saveFile(){
    fetch(this.props.url+"/login",{
        method : "POST",
        mode: 'cors',
        body: JSON.stringify({email:this.state.email,password:shake256(this.state.password, 512)})
      }).then((response)=>{
          this.props.changeComp();
    })
  }

  render() {
    return (
        <div className="limiter">
		<div className="container-login100">
			<div className="wrap-login100">
				<form className="login100-form validate-form">
					<span className="login100-form-title p-b-43">
						Login to continue
					</span>
					
					
					<div className="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
						<input className="input100" type="text" name="email"/>
						<span className="focus-input100"></span>
						<span className="label-input100">Email</span>
					</div>
					
					
					<div className="wrap-input100 validate-input" data-validate="Password is required">
						<input className="input100" type="password" name="pass"/>
						<span className="focus-input100"></span>
						<span className="label-input100">Password</span>
					</div>

					<div className="flex-sb-m w-full p-t-3 p-b-32">
						<div className="contact100-form-checkbox">
							<input className="input-checkbox100" id="ckb1" type="checkbox" name="remember-me"/>
							<label className="label-checkbox100" htmlFor="ckb1">
								Remember me
							</label>
						</div>

						<div>
							<a href="#" className="txt1">
								Forgot Password?
							</a>
						</div>
					</div>
			

					<div className="container-login100-form-btn">
						<button className="login100-form-btn">
							Login
						</button>
					</div>
					
					<div className="text-center p-t-46 p-b-20">
						<span className="txt2">
							or sign up using
						</span>
					</div>

					<div className="login100-form-social flex-c-m">
						<a href="#" className="login100-form-social-item flex-c-m bg1 m-r-5">
							<i className="fa fa-facebook-f" aria-hidden="true"></i>
						</a>

						<a href="#" className="login100-form-social-item flex-c-m bg2 m-r-5">
							<i className="fa fa-twitter" aria-hidden="true"></i>
						</a>
					</div>
				</form>

				<div className="login100-more" style={{"backgroundImage": "url('images/bg-01.jpg')"}}>
				</div>
			</div>
		</div>
	</div>
    );
  }
}

export default FileEdit;
