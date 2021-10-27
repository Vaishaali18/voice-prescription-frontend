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
import './patientabout.css'
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
                <a href="/patient/about" class="active list-group-item list-group-item-action py-2 ripple" aria-current="true">
                  <i class="fa fa-address-book" aria-hidden="true" style={{'margin-right': '1vw'}}></i><span>About</span>
                </a>
               
                <a href="/patient/book" class="list-group-item list-group-item-action py-2 ripple"
                  ><i class="fa fa-book" aria-hidden="true" style={{'margin-right': '1vw'}}></i><span>Book appointment</span></a
                >
                <a href={"/patient/appointments/" +patientId }  class="list-group-item list-group-item-action py-2 ripple"
                  ><i class="fa fa-arrow-circle-right " aria-hidden="true" style={{'margin-right': '1vw'}}></i><span>Schedule</span></a
                >
                <a href="/patient/contact" class="list-group-item list-group-item-action py-2 ripple">
                  <i class="fa fa-phone" aria-hidden="true" style={{'margin-right': '1vw'}}></i><span>Contact</span>
                </a>
              </div>
            </div>
          </nav>
          
      
        
          
         
        </header>

        <main style={{'margin-top': '58px'}}>
        <section class="section about">
	<div class="container">
		<div class="row align-items-center">
			
			<div class="col-lg-8 col-sm-6">
				<div class="about-img mt-4 mt-lg-0">
					<img src="https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg?size=338&ext=jpg" alt="" class="img-fluid"/>
				</div>
			</div>
			<div class="col-lg-8">
				<div class="about-content pl-4 mt-4 mt-lg-0">
					<h2 class="title-color">Personal care <br/>&amp; healthy living</h2>
					<p class="mt-4 mb-5">We provide best leading physician service. There are no enduring services that will sooth the pain and repel the pains of those blinded or praised.</p>

					<a href="#serv" class="btn btn-main-2 btn-round-full btn-icon">Services<i class="fa fa-arrow-circle-down ml-3"></i></a>
        </div>
      </div>
    </div>
  </div>
</section>  

<section class="sec service gray-bg" id="serv">
  <h2 style={{'textAlign':'center','color':'#223a66','marginBottom':'20px'}}>Services</h2>
<div class="row">
			<div class="col-lg-4 col-md-6 col-sm-6">
				<div class="service-item mb-4">
					<div class="icon d-flex align-items-center">
						<i class="fa fa-medkit"></i>
						<h4 class="mt-3 mb-3">General</h4>
					</div>

					<div class="content">
						<p class="mb-4"> Our General Physicians rely on a wide variety of diagnostic scans and tests</p>
					</div>
				</div>
			</div>

			<div class="col-lg-4 col-md-6 col-sm-6">
				<div class="service-item mb-4">
					<div class="icon d-flex align-items-center">
						<i class="fa fa-heartbeat"></i>
						<h4 class="mt-3 mb-3">Heart Disease</h4>
					</div>
					<div class="content">
						<p class="mb-4">We have vast experience in the most complicated coronary artery bypass surgery</p>
					</div>
				</div>
			</div>
			
			<div class="col-lg-4 col-md-6 col-sm-6">
				<div class="service-item mb-4">
					<div class="icon d-flex align-items-center">
						<i class="fa fa-user-md"></i>
						<h4 class="mt-3 mb-3">Best doctors</h4>
					</div>
					<div class="content">
						<p class="mb-4">We have the best doctors specialized in different fields who take take the best care</p>
					</div>
				</div>
			</div>


			<div class="col-lg-4 col-md-6 col-sm-6">
				<div class="service-item mb-4">
					<div class="icon d-flex align-items-center">
						<i class="fa fa-stethoscope "></i>
						<h4 class="mt-3 mb-3">Pediatrician</h4>
					</div>

					<div class="content">
						<p class="mb-4">Our pediatricians have specialised training in physical, emotional and behavioural needs of children</p>
					</div>
				</div>
			</div>

			<div class="col-lg-4 col-md-6 col-sm-6">
				<div class="service-item mb-4">
					<div class="icon d-flex align-items-center">
						<i class="fa fa-hospital-o"></i>
						<h4 class="mt-3 mb-3">Neurology</h4>
					</div>
					<div class="content">
						<p class="mb-4">Neuro departments are equipped with best team and art facilities like Neuro radiology,etc</p>
					</div>
				</div>
			</div>
			
			<div class="col-lg-4 col-md-6 col-sm-6">
				<div class="service-item mb-4">
					<div class="icon d-flex align-items-center">
						<i class="fa fa-ambulance"></i>
						<h4 class="mt-3 mb-3">Gynecology</h4>
					</div>
					<div class="content">
						<p class="mb-4">Our team of specialists has gynecologists, surgeons specializing in laparoscopy</p>
					</div>
        </div>
      </div>
      </div>
    </section>
        </main>
      
        </div>
       )
}