import React from 'react'
import {useState,useContext,useEffect} from 'react'
import Axios from "axios"
import UserContext from "../../context/UserContext"
import { useHistory } from 'react-router-dom';
import ErrorNotice from '../../Misc/ErrorNotice';
import  { Redirect } from 'react-router-dom'
import '../admin/Admin.css'
import '../patient/patient.css'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export default function App()
{
  const [items,setItems] =useState([]);
  const history = useHistory();
  const [patientId,setPatientId] = useState();
  const [error, setError] = useState();

  const insertId = async (doctorId) => {
    try{
      const bookinfo = { doctorId,patientId }
      console.log(bookinfo)
      await Axios.post("https://voice-prescription-ai.herokuapp.com/doctor/booking/", bookinfo);
      history.push("/patient/about");
      } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
}
  }
  const submit = (doctorId) => {
    confirmAlert({
      title: 'Confirm to book',
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            console.log(doctorId)
            insertId(doctorId)
          }
        },
        {
          label: 'No',
          onClick: () => alert('Click No')
        }
      ]
    });
  };
  useEffect(()=>{
    
      const getDetails = async () => {
          const res = await Axios.get("https://voice-prescription-ai.herokuapp.com/users/bookCardio"); 
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
      getDetails()
      getProfile();
   },[])
       return(
       <div>
        <header>
        <nav id="sidebarMenu" class="collapse d-lg-block sidebar collapse bg-dark" style ={{'top' : '7vw','zIndex' : '1','marginBottom':'-1500px','padding': '0px'}}>
            <div class="position-fixed">
              <div class="list-group list-group-flush mx-3 mt-4">
                <a href="/patient/about" class="list-group-item list-group-item-action py-2 ripple" aria-current="true">
                  <i class="fa fa-address-book" aria-hidden="true" style={{'margin-right': '1vw'}}></i><span>About</span>
                </a>
               
                <a href="/patient/book" class="active list-group-item list-group-item-action py-2 ripple"
                  ><i class="fa fa-book" aria-hidden="true" style={{'margin-right': '1vw'}}></i><span>Book appointment</span></a
                >
                <a href={"/patient/appointments/" +patientId } class="list-group-item list-group-item-action py-2 ripple"
                  ><i class="fa fa-arrow-circle-right " aria-hidden="true" style={{'margin-right': '1vw'}}></i><span>Schedule</span></a
                >
                <a href="/patient/contact" class="list-group-item list-group-item-action py-2 ripple">
                  <i class="fa fa-phone" aria-hidden="true" style={{'margin-right': '1vw'}}></i><span>Contact</span>
                </a>
              </div>
            </div>
          </nav>
          <nav class="navbar navbar-expand-lg navbar-primary bg-dark" style ={{'zIndex': '1','margin-top':'4vw'}}>
    
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup" style = {{'margin-left' : '30%'}}>
      <div class="navbar-nav">
        <a class="nav-item nav-link active" href="/patient/book/cardiologist" style={{'margin-right' : '3vw','color':'white'}}>Cardiologist <span class="sr-only">(current)</span></a>
        <a class="nav-item nav-link extra" href="/patient/book/pediatrician" style={{'margin-right' : '3vw'}}>Pediatrician</a>
        <a class="nav-item nav-link extra" href="/patient/book/gynecologist" style={{'margin-right' : '3vw'}}>Gynecologist</a>
        <a class="nav-item nav-link extra" href="/patient/book/neurologist" style={{'margin-right' : '3vw'}}>Neurologist</a>
        <a class="nav-item nav-link extra" href="/patient/book/general" style={{'margin-right' : '3vw'}}>General</a>
      </div>
    </div>
   
  </nav>
        
        </header>

        <main>
          <div class="container pt-4"></div>
          <div class="container" style ={{'margin-left':'4vw'}}>
          
          <div class="row">
          {items.map(item => (
          <div class="card text-dark bg-light " key ={item._id} style={{'max-width': '18rem','margin-bottom':'3rem', 'padding' : 'inherit'}}>
               <div class="card-header ml-0" style={{'background-color': 'royalblue','color':'white'}}>{item.firstname +" "+ item.lastname}</div>
                 <div class="card-body"  style={{'background-color': 'aliceblue'}}>
                 <h5 class="card-title">{item.specialization}</h5>
                 <p class="card-text">
                     {item.email}
                 </p>
                 <p class="card-text">
                   Timing :  {item.timing}
                 </p>
                 <button type="button" onClick={() => {
                  submit(item._id)
                }} class="btn btn-dark">Book</button>
              </div>
              
          </div>
          ))}
        </div>
       
       </div>      
        </main>
      
        </div>
       )
}