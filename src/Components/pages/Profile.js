import React, { useContext, useState ,useEffect} from "react";

import Axios from "axios"
export default function Profile(props) {
    
    
    const [email,setEmail]=useState();
    const [name,setName]=useState();
    
    useEffect(()=>{
      
        const getProfile = async () => {
            let token = await localStorage.getItem("auth-token");
           
            const tokenRes = await Axios.post("https://voice-prescription-ai.herokuapp.com/users/tokenIsValid", null, { headers: { "x-auth-token": token } });
            console.log(tokenRes.data);
            if (tokenRes.data) {
                const userRes = await Axios.get("https://voice-prescription-ai.herokuapp.com/users/profile", { headers: { "x-auth-token": token } });
                console.log(userRes);
                setEmail(userRes.data.email)
                setName(userRes.data.displayname)
                
            }
        }
        getProfile();
     },[])
    return (
       
    
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
    )
}
