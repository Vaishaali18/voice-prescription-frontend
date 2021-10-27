import React from 'react'
import {useState,useContext,useEffect} from 'react'
import Axios from "axios"
import UserContext from "../../context/UserContext"
import { useHistory } from 'react-router-dom';
import ErrorNotice from '../../Misc/ErrorNotice';
import  { Redirect } from 'react-router-dom'
import '../admin/Admin.css'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function App()
{
  const history = useHistory();
  const { userData, setUserData } = useContext(UserContext);
    const logout = () => {
      setUserData({
          token: undefined,
          user: undefined
      });
      localStorage.setItem("auth-token", "");
      history.push('/')
  }
    const [items,setItems] =useState([]);
    useEffect(()=>{
      
        const getDetails = async () => {
            const res = await Axios.get("https://voice-prescription-ai.herokuapp.com/doctor/viewPedi"); 
            setItems(res.data);
        }
        getDetails();
     },[])
     const submit = (id) => {
      confirmAlert({
        title: 'Confirm to delete',
      //  message: 'Are you sure to do this',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              console.log(id)
              deleteDoc(id)
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
    };

     const deleteDoc = async (id) =>{
     
       console.log(id)
       Axios.delete("https://voice-prescription-ai.herokuapp.com/doctor/delete",{
         data:{
           id
         }
       });
      
       console.log("hello")
       history.push("/admin");
     }
       return(
       <div>
        <header>
      
        <nav id="sidebarMenu" class="collapse d-lg-block sidebar collapse bg-dark" >
            <div class="position-sticky">
              <div class="list-group list-group-flush mx-3 mt-4">
              <div >
                <a href="/admin" class="list-group-item list-group-item-action py-2 ripple" aria-current="true">
                  <i class="fa fa-address-book" aria-hidden="true" style={{'margin-right': '3vw'}}></i><span>About</span>
                </a>
                </div>
                <div >
                <a href="/admin/add" class="list-group-item list-group-item-action py-2 ripple" aria-current="true">
                  <i class="fa fa-user-plus" aria-hidden="true" style={{'margin-right': '3vw'}}></i><span>Add</span>
                </a>
                </div>
                <div>
                <a href="/admin/view" class="active list-group-item list-group-item-action py-2 ripple">
                  <i class="fa fa-list" aria-hidden="true" style={{'margin-right': '3vw'}}></i><span>View</span>
                </a>
                </div>
                <div>
                <a href="/admin/contact" class="list-group-item list-group-item-action py-2 ripple"
                  ><i class="fa fa-phone" aria-hidden="true" style={{'margin-right': '3vw'}}></i><span>Contact</span></a
                >
                </div>
              </div>
            </div>
          </nav>
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

                <button type="button" class="btn btn-danger" onClick={logout}>Logout</button>
          </div>
        
        </nav>
          <nav class="navbar navbar-expand-lg navbar-dark bg-dark" style={{'margin-top':'4.2vw','zIndex':'1'}}>
    
  <div class="collapse navbar-collapse" id="navbarNavAltMarkup" style = {{'margin-left' : '30%'}}>
    <div class="navbar-nav">
      <a class="nav-item nav-link" href="/admin/view/cardiologist" style={{'margin-right' : '3vw'}}>Cardiologist <span class="sr-only">(current)</span></a>
      <a class="nav-item nav-link active" href="/admin/view/pediatrician" style={{'margin-right' : '3vw'}}>Pediatrician</a>
      <a class="nav-item nav-link" href="/admin/view/gynecologist" style={{'margin-right' : '3vw'}}>Gynecologist</a>
      <a class="nav-item nav-link" href="/admin/view/neurologist" style={{'margin-right' : '3vw'}}>Neurologist</a>
      <a class="nav-item nav-link" href="/admin/view/general" style={{'margin-right' : '3vw'}}>General</a>
    </div>
  </div>
 
</nav>
        </header>

        <main style={{'margin-top': '58px'}}>
          <div class="container pt-4"></div>
          <div class="container" style ={{'margin-left':'4vw'}}>
          <div class="row">
          {items.map(item => (
          <div class="card text-dark bg-light" key ={item._id} style={{'max-width': '18rem','margin-bottom':'3rem', 'padding' : 'inherit'}}>
               <div class="card-header ml-0" style={{'background-color': 'royalblue','color':'white'}}>{item.firstname +" "+ item.lastname}</div>
                 <div class="card-body" style={{'background-color': 'aliceblue'}}>
                 <h5 class="card-title">{item.specialization}</h5>
                 <p class="card-text">
                     {item.email}
                 </p>
                 <p class="card-text">
                   Timing :  {item.timing}
                 </p>
                 <button type="button" onClick={(e) => {
                  submit(item._id)
                }} class="btn btn-dark">Delete</button>
              </div>
              
          </div>
          ))}
        </div>
       </div>  
        </main>
      
        </div>
       )
}