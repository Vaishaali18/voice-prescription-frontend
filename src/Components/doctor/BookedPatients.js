import React from 'react'
import {useState,useContext,useEffect} from 'react'
import Axios from "axios"
import UserContext from "../../context/UserContext"
import { useHistory } from 'react-router-dom';
import ErrorNotice from '../../Misc/ErrorNotice';
import  { Redirect } from 'react-router-dom'
import './BookedPatients.css'

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function App()
{
    
    const [items,setItems] =useState([]);
    const history = useHistory();
   // const [doctorId,setdoctorId] = useState();
    const doctorId = history.location.state.id;
    const { userData, setUserData } = useContext(UserContext);
    const logout = () => {
      setUserData({
          token: undefined,
          user: undefined
      });
      localStorage.setItem("auth-token", "");
      history.push('/')
  }
  const profile = () => {
    history.push('/doctor/profile')
}
    
    const visit = async(patientId,bookingId) => {
      history.push(
        {pathname:'/doctor/prescribe/'+doctorId+ '/'+patientId,
         state:{doctorId:doctorId,id:patientId,bookingId:bookingId}
      });
    }
    useEffect(()=>{
       
        const getDetails = async () => {
          console.log(doctorId)
            const res = await Axios.get("https://voice-prescription-ai.herokuapp.com/doctor/selectPatients?doctorId="+ doctorId); 
            console.log(res.data)
            setItems(res.data);
        }   

    /*    const getProfile = async () => {
        
            let token = localStorage.getItem("auth-token");
         //   console.log(token)
            const tokenRes = await Axios.post("http://localhost:5000/doctor/tokenIsValid", null, { headers: { "x-auth-token": token } });
            console.log(tokenRes);
            if (tokenRes.data) {
                const res = await Axios.get("http://localhost:5000/doctor/profile", { headers: { "x-auth-token": token } });
               // console.log(userRes);
                setName(res.data.name);
                setEmail(res.data.email);
              //  console.log(id)
            }
        }
        getProfile()*/
        getDetails()
     },[])
    
       return(
       <div>

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
            <button type="button" onClick={profile} class="btn btn-success">Profile</button>
                <button style={{'marginLeft':'2vw'}} type="button" class="btn btn-danger" onClick={logout}>Logout</button>
              </div>
          </div>
        
        </nav>
          </header>
          <div class="container pt-4" style = {{'marginTop' : '5vw'}}>
          <h3 style={{'color': '#223a66'}}>Booked Patients</h3>
<table id="patients" style = {{'marginTop' : '3vw'}}>
<colgroup>
     
       <col span="1" style={{'width': '40%'}}/>
       <col span="1" style={{'width': '40'}}/>
    </colgroup>
  <thead>
  
    <th>Name</th>
    <th>Email</th>
  </thead>
  {items.map(item => (
  <tr class="visit" key ={item._id} onClick={() => {
    visit(item.patientId._id,item._id)
  }}>
    
    <td>{item.patientId.displayname}</td>
    <td>{item.patientId.email}</td>
    
  </tr>
  ))}
</table>
          
           
  </div>
        
        </div>
       )
}
