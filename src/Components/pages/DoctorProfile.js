import React, { useContext, useState ,useEffect} from "react";

import Axios from "axios"
import { useHistory } from 'react-router-dom';
export default function Profile(props) {
    
    
    const [email,setEmail]=useState();
    const [name,setName]=useState();
    const history = useHistory();
    const logout = () => {
        history.push('/')
    }
    const profile = () => {
      history.push('/doctor/profile')
  }
    
    useEffect(()=>{
      
        const getProfile = async () => {
        
            let token = localStorage.getItem("auth-token");
         //   console.log(token)
            const tokenRes = await Axios.post("https://voice-prescription-ai.herokuapp.com/doctor/tokenIsValid", null, { headers: { "x-auth-token": token } });
            console.log(tokenRes);
            if (tokenRes.data) {
                const res = await Axios.get("https://voice-prescription-ai.herokuapp.com/doctor/profile", { headers: { "x-auth-token": token } });
               // console.log(userRes);
                setName(res.data.name);
                setEmail(res.data.email);
              //  console.log(id)
            }
        }
        getProfile()
     },[])
    return (
       <>
        <header>
          <nav id="main-navbar" class="navbar navbar-expand-lg navbar-light bg-white fixed-top">
          
          <div class="container-fluid">
            
            <button
              class="navbar-toggler"
              type="button"
              data-mdb-toggle="collapse"
              data-mdb-target="#sidebarMenu"
              aria-controls="sidebarMenu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i class="fas fa-bars"></i>
            </button>
      
        
            <a class="navbar-brand" href="#">
              Medi+
            </a> 
            <div>
            
                <button style={{'marginLeft':'2vw'}} type="button" class="btn btn-danger" onClick={logout}>Logout</button>
              </div>
          </div>
        
        </nav>
          </header>
        <div class="profilepage container">
            <h1>Profile</h1>
            <form>
            <div class="form-group row">
                    <label for="inputPassword" class=" col-form-label">Username</label>
                    <div class="col-sm-10">
                    
                         <input type="text"  readonly="true" class="form-control" id="email"  value={name} /> 
                    
                       
                    </div>
                </div>
                <div class="form-group row">
                    <label for="inputPassword" class=" col-form-label">Email Address</label>
                    <div class="col-sm-10">
                    
                       <input type="text" class="form-control" value={email} readonly="true" /> 
                    
                        
                    </div>
                </div>
            </form>
        </div>
        </>
    )
}
