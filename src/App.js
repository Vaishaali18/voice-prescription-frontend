import React from 'react'
import { useState, useEffect } from 'react'
import { BrowserRouter, Switch, Route,Redirect } from "react-router-dom"
import Home from "./Components/pages/Home"
import Login from "./Components/auth/Login"
import Register from "./Components/auth/Register"
import Admin from "./Components/admin/Admin"
import ProtectedRoute from "./Components/auth/ProtectedRoute"
import Header from "./Components/layouts/Header"
import AddDoctor from "./Components/admin/AddDoctor"
import ViewDoctor from "./Components/admin/ViewDoctor"
import CardioDoctor from "./Components/doctorFilter/CardioDoctor"
import PediDoctor from "./Components/doctorFilter/PediDoctor"
import GynoDoctor from "./Components/doctorFilter/GynoDoctor"
import NeuroDoctor from "./Components/doctorFilter/NeuroDoctor"
import GenDoctor from "./Components/doctorFilter/GenDoctor"
import PatientAbout from "./Components/patient/PatientAbout"
import PatientBook from "./Components/patient/PatientBook"
import BookedPatient from './Components/doctor/BookedPatients'
import Axios from "axios"
import DoctorProfile from './Components/pages/DoctorProfile'
import UserContext from "./context/UserContext"
import Profile from './Components/pages/Profile'
import Prescribe from './Components/pages/Prescribe'
import BookCardio from './Components/bookdoctor/BookCardio'
import BookPedi from './Components/bookdoctor/BookPedi'
import BookGyno from './Components/bookdoctor/BookGyno'
import BookNeuro from './Components/bookdoctor/BookNeuro'
import BookGen from './Components/bookdoctor/BookGen'
import YourAppointments from './Components/patient/YourAppointments'
import PatientContact from './Components/patient/PatientContact'
import AdminContact from './Components/admin/AdminContact'

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
        )
      }
    />
  );
  



export default function App() {
    const [state, setState] = useState({isLoading: true, authenticated: false});
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined
    })
    // const [loading, setloading] = useState(false)
    
    useEffect(() => {
        // setloading(false)

        const checkLoggedIn = async () => {
            let token = await localStorage.getItem("auth-token");
           
            if (token === null) {
                localStorage.setItem("auth-token", "");
                token = "";
            }
            const tokenRes = await Axios.post("https://voice-prescription-ai.herokuapp.com/users/tokenIsValid", null, { headers: { "x-auth-token": token } });
            
            if (tokenRes.data) {
                const userRes = await Axios.get("https://voice-prescription-ai.herokuapp.com/users/", { headers: { "x-auth-token": token } });
              
                setUserData({ token, user: userRes.data });
                setState({isLoading: false, authenticated: token});
            }
        }
        checkLoggedIn();
    }, [])
  
    return (
        <div  >


            <BrowserRouter>




                <UserContext.Provider value={{ userData, setUserData }}>
                    <div>
                        <Header />

                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/register" component={Register} />
                           {/* <ProtectedRoute path="/profile" component={Profile}/> */}
                           <Route path="/profile" isAuthenticated={state.authenticated} component={Profile} />
                           <Route path="/doctor/profile" isAuthenticated={state.authenticated} component={DoctorProfile} />
                           <Route exact path="/admin" component={Admin} />
                           <Route exact path="/admin/add" component={AddDoctor} />
                           <Route exact path="/admin/view" component={ViewDoctor} />
                           <Route exact path="/admin/contact" component={AdminContact} />
                           <Route exact path="/admin/view/cardiologist" component={CardioDoctor} />
                           <Route exact path="/admin/view/pediatrician" component={PediDoctor} />
                           <Route exact path="/admin/view/gynecologist" component={GynoDoctor} />
                           <Route exact path="/admin/view/neurologist" component={NeuroDoctor} />
                           <Route exact path="/admin/view/general" component={GenDoctor} />
                           <Route exact path="/patient/about" component={PatientAbout} />
                           <Route exact path="/patient/book" component={PatientBook} />
                           <Route exact path="/patient/contact" component={PatientContact} />
                           <Route exact path="/patient/appointments/:id" component={YourAppointments} />
                           <Route exact path="/patient/book/cardiologist" component={BookCardio} />
                           <Route exact path="/patient/book/pediatrician" component={BookPedi} />
                           <Route exact path="/patient/book/gynecologist" component={BookGyno} />
                           <Route exact path="/patient/book/neurologist" component={BookNeuro} />
                           <Route exact path="/patient/book/general" component={BookGen} />
                           <Route exact path="/doctor/patientslist/:id" component={BookedPatient} />
                           <Route exact path="/doctor/prescribe/:doctorId/:id" component={Prescribe} />
                        </Switch>
                    </div>

                </UserContext.Provider>

            </BrowserRouter>


        </div>

    )
}
