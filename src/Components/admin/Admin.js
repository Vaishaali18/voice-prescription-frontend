import React from 'react'
import {useState,useContext,useEffect} from 'react'
import Axios from "axios"
import UserContext from "../../context/UserContext"
import { useHistory } from 'react-router-dom';
import ErrorNotice from '../../Misc/ErrorNotice';
import  { Redirect } from 'react-router-dom'
import './Admin.css'
import { FiUser } from "react-icons/md";
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../../node_modules/font-awesome/css/font-awesome.min.css';
export default function App()
{
  const [usersCount,setUsersCount] = useState();
  const [doctorsCount,setDoctorsCount] = useState();
  const [bookingCount,setBookingCount] = useState();
  const history = useHistory();
  const logout = () => {
    history.push('/')
}

useEffect(()=>{
  
    const getUsersCount = async() =>{
        const res = await Axios.get("https://voice-prescription-ai.herokuapp.com/users/count");
        setUsersCount(res.data.count)
      }
      const getDoctorsCount = async() =>{
        const res = await Axios.get("https://voice-prescription-ai.herokuapp.com/doctor/count");
        setDoctorsCount(res.data.count)
      }
      const getBookingCount = async() =>{
        const res = await Axios.get("https://voice-prescription-ai.herokuapp.com/doctor/bookcount");
        setBookingCount(res.data.count)
      }
  getBookingCount()
  getDoctorsCount();
  getUsersCount();
},[])
       return(
       <div>

        
        <header>
      
          <nav id="sidebarMenu" class="collapse d-lg-block sidebar collapse bg-dark" style = {{'marginBottom':'-1500px'}}>
            <div class="position-fixed">
              <div class="list-group list-group-flush mx-3 mt-4">
              <div >
                <a href="/admin" class="active list-group-item list-group-item-action py-2 ripple" aria-current="true">
                  <i class="fa fa-address-book" aria-hidden="true" style={{'margin-right': '3vw'}}></i><span>About</span>
                </a>
                </div>
                <div >
                <a href="/admin/add" class="list-group-item list-group-item-action py-2 ripple" aria-current="true">
                  <i class="fa fa-user-plus" aria-hidden="true" style={{'margin-right': '3vw'}}></i><span>Add</span>
                </a>
                </div>
                <div>
                <a href="/admin/view" class="list-group-item list-group-item-action py-2 ripple">
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
        
          
              <a class="navbar-brand" href="#" >
                Medi+
              </a>

                  <button type="button" class="btn btn-danger" onClick={logout}>Logout</button>
            </div>
          
          </nav>
     
        </header>

        <div style={{'marginTop':'12%','marginLeft':'20vw'}}>
        <div class="row m-t-25">
             <div class="col-sm-6 col-lg-3">
              <div class="overview-item overview-item--c1">
                <div class="overview__inner">
                    <div class="overview-box clearfix">
                      <div class="icon">
                      <i class="fa fa-user-md "></i>
                        </div>
                        <div class="text">
                        <h2>{doctorsCount}</h2>
                        <span>doctors</span>
                    </div>
                    
                   </div>
               </div>
            </div>
        </div>
        <div class="col-sm-6 col-lg-3">
              <div class="overview-item overview-item--c2">
                <div class="overview__inner">
                    <div class="overview-box clearfix">
                      <div class="icon">
                      <i class="fa fa-users "></i>
                        </div>
                        <div class="text">
                        <h2>{usersCount}</h2>
                        <span>users</span>
                    </div>
                    
                   </div>
               </div>
            </div>
        </div>
        <div class="col-sm-6 col-lg-3">
              <div class="overview-item overview-item--c3">
                <div class="overview__inner">
                    <div class="overview-box clearfix">
                      <div class="icon">
                      <i class="fa fa-book "></i>
                        </div>
                        <div class="text">
                        <h2>{bookingCount}</h2>
                        <span>bookings</span>
                    </div>
                    
                   </div>
               </div>
            </div>
        </div>
        </div>
      </div>
        </div>
       )
}