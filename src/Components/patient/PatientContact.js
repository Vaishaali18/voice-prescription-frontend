import React from 'react'
import {useState,useContext,useEffect} from 'react'
import Axios from "axios"
import UserContext from "../../context/UserContext"
import { useHistory } from 'react-router-dom';
import ErrorNotice from '../../Misc/ErrorNotice';
import  { Redirect } from 'react-router-dom'
import '../admin/Admin.css'

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function App()
{  
  const [patientId,setPatientId] = useState();
  useEffect(()=>{
    
    
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
 
    getProfile();
 },[])
       return(
       <div>
        <header>
      
          <nav id="sidebarMenu" class="collapse d-lg-block sidebar collapse bg-dark" style ={{'marginBottom':'-1500px','zIndex' : '1'}}>
            <div class="position-fixed">
            <div class="list-group list-group-flush mx-3 mt-4">
                <a href="/patient/about" class="list-group-item list-group-item-action py-2 ripple" aria-current="true">
                  <i class="fa fa-address-book" aria-hidden="true" style={{'margin-right': '1vw'}}></i><span>About</span>
                </a>
               
                <a href="/patient/book" class="list-group-item list-group-item-action py-2 ripple"
                  ><i class="fa fa-book" aria-hidden="true" style={{'margin-right': '1vw'}}></i><span>Book appointment</span></a
                >
                <a href={"/patient/appointments/" +patientId }  class="list-group-item list-group-item-action py-2 ripple"
                  ><i class="fa fa-arrow-circle-right " aria-hidden="true" style={{'margin-right': '1vw'}}></i><span>Schedule</span></a
                >
                <a href="/patient/contact" class="active list-group-item list-group-item-action py-2 ripple">
                  <i class="fa fa-phone" aria-hidden="true" style={{'margin-right': '1vw'}}></i><span>Contact</span>
                </a>
              </div>
            </div>
          </nav>
          
      
        
          
         
        </header>

        <main style={{'margin-top': '58px'}}>
     
<section class="mb-4" style={{'margin':'100px'}}>


    <h2 class="h1-responsive font-weight-bold text-center my-4">Contact us</h2>

    <p class="text-center w-responsive mx-auto mb-5">Do you have any questions? Please do not hesitate to contact us directly. Our team will come back to you within
        a matter of hours to help you.</p>

    <div class="row">

        <div class="col-md-9 mb-md-0 mb-5">
            <form id="contact-form" name="contact-form" action="mail.php" method="POST">

             
                <div class="row">

               
                    <div class="col-md-6">
                        <div class="md-form mb-0">
                            <input type="text" id="name" name="name" class="form-control"/>
                            <label for="name" class="">Your name</label>
                        </div>
                    </div>
              
                    <div class="col-md-6">
                        <div class="md-form mb-0">
                            <input type="text" id="email" name="email" class="form-control"/>
                            <label for="email" class="">Your email</label>
                        </div>
                    </div>
                

                </div>
            
                <div class="row">
                    <div class="col-md-12">
                        <div class="md-form mb-0">
                            <input type="text" id="subject" name="subject" class="form-control"/>
                            <label for="subject" class="">Subject</label>
                        </div>
                    </div>
                </div>
      
                <div class="row">

              
                    <div class="col-md-12">

                        <div class="md-form">
                            <textarea type="text" id="message" name="message" rows="2" class="form-control md-textarea"></textarea>
                            <label for="message">Your message</label>
                        </div>

                    </div>
                </div>


            </form>

            <div class="text-center text-md-left">
                <a class="btn btn-primary" onclick="document.getElementById('contact-form').submit();">Send</a>
            </div>
            <div class="status"></div>
        </div>

        <div class="col-md-3 text-center">
            <ul class="list-unstyled mb-0">
                <li><i class="fa fa-map-marker fa-2x"></i>
                    <p>Madurai</p>
                </li>

                <li><i class="fa fa-phone mt-4 fa-2x"></i>
                    <p>+ 01 234 567 89</p>
                </li>

                <li><i class="fa fa-envelope mt-4 fa-2x"></i>
                    <p>contact@admin.com</p>
                </li>
            </ul>
        </div>
     

    </div>

</section>

        </main>
      
        </div>
       )
}