import React from 'react'
import {useState,useContext} from 'react'
import Axios from "axios"
import UserContext from "../../context/UserContext"
import { useHistory } from 'react-router-dom';
import ErrorNotice from '../../Misc/ErrorNotice';
import  { Redirect } from 'react-router-dom'
import './Admin.css'
import './AddDoctor.css'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'

export default function App()
{
  const [email, setEmail] = useState();
  const [firstname, setFirstName] = useState();
  const [lastname, setLastName] = useState();
  const [specialization, setSpecialization] = useState('Specialization');
  const [timing, setTiming] = useState();
  const { setUserData } = useContext(UserContext);
  const history = useHistory();
  const [error, setError] = useState();
  const [loading, setloading] = useState(false)
  const [selectedFile, setSelectedFile] = useState([]);
  const [profile,setProfile] = useState("");
  const logout = () => {
    history.push('/')
}
  const handleSelect=(e)=>{
    console.log(e);
    setSpecialization(e)
  }

  const onFileChange = (e) => {
    setSelectedFile(e.target.files);
     console.log(selectedFile[0])
    encodeFileBase64(selectedFile[0])
  };

  const encodeFileBase64 = (file) => {
    var reader = new FileReader();
    try{
      reader.readAsDataURL(file);
      reader.onload = () => {
        var Base64 = reader.result;
        //console.log(Base64);
        setProfile(Base64);
      };
    }catch{
      reader.onerror = (error) => {
        console.log("error: ", error);
      };
    } 
  };
  
  
  const submit = async (e) => {
      
      e.preventDefault();
      setloading(true);
      
        try{  
      //    console.log(selectedFile[0])
      /*    var reader = new FileReader();
    
          reader.readAsDataURL(selectedFile[0]);
          reader.onload = () => {
            var Base64 = reader.result;
            //console.log(Base64);
            setProfile(Base64);
            console.log("hi");
            console.log(profile)
          };*/
          const doctorinfo = { firstname, lastname, email, specialization, timing}
          const res= await Axios.post("https://voice-prescription-ai.herokuapp.com/doctor/add/", doctorinfo);
          history.push("/admin");
        } catch (err) {
          err.response.data.msg && setError(err.response.data.msg);
      }
      
    }
       return(
       <div>
        <header>
      
          <nav id="sidebarMenu" class="collapse d-lg-block sidebar collapse bg-dark">
            <div class="position-sticky">
              <div class="list-group list-group-flush mx-3 mt-4">
              <div >
                <a href="/admin" class="list-group-item list-group-item-action py-2 ripple" aria-current="true">
                  <i class="fa fa-address-book" aria-hidden="true" style={{'margin-right': '3vw'}}></i><span>About</span>
                </a>
                </div>
              <div >
                <a href="/admin/add" class="active list-group-item list-group-item-action py-2 ripple" aria-current="true">
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
        
          
              <a class="navbar-brand" href="#">
                Medi+
              </a>

                  <button type="button" class="btn btn-danger" onClick={logout}>Logout</button>
            </div>
          
          </nav>
        </header>

        <main style={{'margin-left': '58px'}}>
        <div class="container"> <div class=" text-center mt-5 ">
    </div>
    <div class="row " style={{'marginTop':'12%'}}>
        <div class="col-lg-7 mx-auto">
            <div class="card mt-2 mx-auto p-4 bg-light">
                <div class="card-body bg-light">
                    <div class="container">
                        <form id="contact-form" role="form" onSubmit={submit} formenctype="multipart/form-data"> 
                            <div class="controls">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group"> <label for="form_name">Firstname</label> <input id="form_name" type="text" name="firstname" class="form-control" placeholder="Enter Firstname" required="required" data-error="Firstname is required." onChange={(e) => setFirstName(e.target.value)}/> </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group"> <label for="form_lastname">Lastname</label> <input id="form_lastname" type="text" name="lastname" class="form-control" placeholder="Enter Lastname" required="required" data-error="Lastname is required." onChange={(e) => setLastName(e.target.value)}/> </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group"> <label for="form_email">Email</label> <input id="form_email" type="email" name="email" class="form-control" placeholder="Enter Email" required="required" data-error="Valid email is required." onChange={(e) => setEmail(e.target.value)}/> </div>
                                    </div>
                                    <div class="col-md-6" style={{'margin-top' : '2.5vw'}}>
                {['Success'].map(
    (variant) => (                     
                                    <DropdownButton
                                    key={variant}
                                    id={`dropdown-variants-${variant}`}
                                    variant={variant.toLowerCase()}
                                 title={specialization}
                                 id="dropdown-menu-align-right"
                                  onSelect={handleSelect}
                                 >
              <Dropdown.Item eventKey="Cardiologist">Cardiologist</Dropdown.Item>
              <Dropdown.Item eventKey="Pediatrician">Pediatrician</Dropdown.Item>
              <Dropdown.Item eventKey="Gynecologist">Gynecologist</Dropdown.Item>
              <Dropdown.Item eventKey="Neurologist">Neurologist</Dropdown.Item>
              <Dropdown.Item eventKey="General">General</Dropdown.Item>
      </DropdownButton>
    ),
  )}
                                       
                                    </div>
                                </div>
                               
     
                                <div class="row">
                                    <div class="col-md-12">
       
                                    <div class="form-group"> <label for="form_name">Timing</label> <input id="form_name" type="text" name="timing" class="form-control" placeholder="Enter Timing" required="required" data-error="Firstname is required." onChange={(e) => setTiming(e.target.value)}/> </div>
                                    </div>
                                    
                                    <div class="col-md-12"> <input type="submit" class="btn btn-success btn-send pt-2 btn-block " value="Add"/> </div>
                                </div>
            
                            </div>
                           
                        </form>
                    </div>
                </div>
            </div> 
        </div>
    </div>
</div>
          
        </main>
      
        </div>
       )

}