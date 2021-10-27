import React from 'react'
import {useState,useContext,useEffect} from 'react'
import Axios from "axios"
import UserContext from "../../context/UserContext"
import { useHistory } from 'react-router-dom';
import ErrorNotice from '../../Misc/ErrorNotice';
import  { Redirect } from 'react-router-dom'
import '../admin/Admin.css'
import './patient.css'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Tooltip from 'react-tooltip-lite';
import { useParams } from "react-router-dom";
export default function App()
{
    const [items,setItems] =useState([]);
    const [patientId,setPatientId] = useState();
    const history = useHistory();
    const { id } = useParams()
    const handleDeleteBooking = async (bookingid) =>{
      confirmAlert({
        title: 'Confirm to delete',
      //  message: 'Are you sure to do this',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              console.log(bookingid)
              deleteBooking(bookingid)
            }
          },
          {
            label: 'No',
            onClick: () => { 
              history.push("/admin");
            }
          }
        ]
      });
    }
    const deleteBooking = async (bookingid) =>{
     
      console.log(id)
      Axios.delete("https://voice-prescription-ai.herokuapp.com/doctor/deletebooking/",{
        data:{
          bookingid
        }
      });
     
      console.log("hello")
      history.push("/patient/book");
    }
  useEffect(()=>{
    
    const getDetails = async () => {
          const res = await Axios.get("https://voice-prescription-ai.herokuapp.com/users/bookedAppointments?patientId="+ id); 
          console.log(res.data)
          setItems(res.data);
      }   

    const getProfile = async () => {
      
      let token = localStorage.getItem("auth-token");
   //   console.log(token)
      const tokenRes = await Axios.post("https://voice-prescription-ai.herokuapp.com/users/tokenIsValid", null, { headers: { "x-auth-token": token } });
      console.log(tokenRes);
      if (tokenRes.data) {
          const userRes = await Axios.get("https://voice-prescription-ai.herokuapp.com/users/profile", { headers: { "x-auth-token": token } });
         // console.log(userRes);
          setPatientId(userRes.data.id)
        //  console.log(id)
        
      }
  }
    getDetails();
    getProfile();
 },[])
       return(
       <div>
        <header>
      
          <nav id="sidebarMenu" class="collapse d-lg-block sidebar collapse bg-dark" style ={{'zIndex' : '1'}}>
            <div class="position-sticky">
            <div class="list-group list-group-flush mx-3 mt-4">
                <a href="/patient/about" class="list-group-item list-group-item-action py-2 ripple" aria-current="true">
                  <i class="fa fa-address-book" aria-hidden="true" style={{'margin-right': '1vw'}}></i><span>About</span>
                </a>
               
                <a href="/patient/book" class="list-group-item list-group-item-action py-2 ripple"
                  ><i class="fa fa-book" aria-hidden="true" style={{'margin-right': '1vw'}}></i><span>Book appointment</span></a
                >
                <a href={"/patient/appointments/" +patientId } class="active list-group-item list-group-item-action py-2 ripple"
                  ><i class="fa fa-arrow-circle-right " aria-hidden="true" style={{'margin-right': '1vw'}}></i><span>Schedule</span></a
                >
                <a href="/patient/contact" class="list-group-item list-group-item-action py-2 ripple">
                  <i class="fa fa-phone" aria-hidden="true" style={{'margin-right': '1vw'}}></i><span>Contact</span>
                </a>
              </div>
            </div>
          </nav>
          
      
        
          
         
        </header>

        <div  style = {{'marginTop' : '10vw'}}>
      
<table id="patients" style={{'width':'60%','margin-left':'30vw'}}>
<colgroup>
        <col span="1" style={{'width': '20%'}}/>
       <col span="1" style={{'width': '30%'}}/>
       <col span="1" style={{'width': '15%'}}/>
       <col span="1" style={{'width': '35%'}}/>
    </colgroup>
  <thead>
  
    <th>Name</th>
    <th>Email</th>
    <th>Specialization</th>
    <th>Timing</th>
    
  </thead>
  {items.map(item => (
    
  <tr title ="Click to delete"class="visit" key ={item._id} onClick={() => {
    handleDeleteBooking(item._id)
  }}>
    
    <td>{item.doctorId.firstname +" "+item.doctorId.lastname}</td>
    <td>{item.doctorId.email}</td>
    <td>{item.doctorId.specialization}</td>
    <td>{item.doctorId.timing}</td>
  </tr>
  ))}
</table>
      </div>
        </div>
       )
}