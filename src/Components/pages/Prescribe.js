import React, { useState, useRef, useEffect, useContext  } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useHistory } from 'react-router-dom';
import SignaturePad from "react-signature-canvas";
import axios from 'axios';
import DOMPurify from 'dompurify';
import { FaSpinner } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Axios from "axios"
import UserContext from "../../context/UserContext";
import Swal from 'sweetalert';
import { Overlay } from 'react-portal-overlay';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './prescribe.css';
import * as $ from 'jquery';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
window['jQuery'] = window['$'] = $;



export default function App()
{
	var curr = new Date();
	curr.setDate(curr.getDate());
	var date = curr.toISOString().substr(0,10);
    const history = useHistory();
   
    
    const patientId = history.location.state.id;
    const doctorId = history.location.state.doctorId;
    const bookingId = history.location.state.bookingId;
    
    const divRef = useRef();//scroll
    const [items,setItems] = useState();
    const [email,setEmail]=useState();
    const [name,setName]=useState();
    const [doctorName,setDoctorName] = useState("")
    const [displayName,setDisplayName] = useState("");
    const [displayEmail,setDisplayEmail] = useState("");
    const [displayId,setDisplayId]=useState("");
    const [show, setShow] = useState(false);//show prescription view
    const [currentRow, setCurrentRow] = useState(0);//
    const handleClose = () => setShow(false);
    const sigCanvas = useRef({});
    const handleClear= () =>{
        sigCanvas.current.clear();
    }
    AOS.init({ offset: 150, duration: 550 });

   

    const [buttonText, setButtonText] = useState("START");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('<h3></h3>');

    const [isBackgroundBlue, setIsBackgroundBlue] = useState(false);
    const [isBorder, setIsBorder] = useState(false);
    const borderstyle = { borderStyle: "ridge", padding: "2rem" };
    const bordernone = { borderStyle: "none" };

    var [text, setText] = useState("");

    let { transcript } = useSpeechRecognition();
    const { finalTranscript, resetTranscript } = useSpeechRecognition()
    const [value1, setValue1] = useState();
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
  const deletebooking = async (bookingid) => {
 
      Axios.delete("https://voice-prescription-ai.herokuapp.com/doctor/deletebooking/",{
        data:{
          bookingid
        }
    });
    history.push(
        {pathname:'/doctor/patientslist/'+doctorId,
         state:{id:doctorId}
      });
     
}

  const close = () => {
    confirmAlert({
        title: 'Want to leave',
        message: 'Are you sure to do this.',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              console.log(bookingId)
              deletebooking(bookingId)
            }
          },
          {
            label: 'No',
            onClick: () => {
                
            }
          }
        ]
      });
  }
    function createTable(data) {//
       
        var prescription = document.querySelector("#resultTable");
        for (var i = 0; i < data.length; i++) {
            document.querySelector("#R" + String(i + 1) + " td").innerHTML = "&#8226";
            document.querySelector("#R" + String(i + 1) + " td span #TA1").value = data[i]["DRUG"];
            document.querySelector("#R" + String(i + 1) + " td span #TA2").value = data[i]["DURATION"];
            document.querySelector("#R" + String(i + 1) + " td span #TA3").value = data[i]["STRENGTH"];
            document.querySelector("#R" + String(i + 1) + " td span #TA4").value = data[i]["ROUTE"];
            document.querySelector("#R" + String(i + 1) + " td span #TA5").value = data[i]["FORM"];
            document.querySelector("#R" + String(i + 1) + " td span #TA6").value = data[i]["DOSAGE"];
            document.querySelector("#R" + String(i + 1) + " td span #TA7").value = data[i]["FREQUENCY"];
            document.getElementById("R" + String(i + 1)).classList.remove("disp");
            setCurrentRow(currentRow + 1)

        }
    }
    const sendMail=async(dirpath,patientId)=>{
       
            
	
            /*const pdfsend=await axios.post("http://localhost:5000/sendpdf",patientdetails);
	    var email_result = pdfsend.data.express;
	    if(email_result=="Done")
		Swal('Email','Email Sent Successfully!!!','success');
	    else
		Swal('Email','Error Occured while sending email','error');*/

       
            const details={
                "email" : displayEmail,
                "dirpath" : dirpath,
                "pateintID" : patientId
            }
      //       #const json = JSON.stringify(details);
       //     console.log(json)
        
                const PdfRes=await axios.post("https://voice-prescription-ai.herokuapp.com/sendpdf",details);
		        Swal('Email','Email Sent Successfully!!!','success');

            

           // Swal('Email','Email Sent Successfully!!!','success');
           

    
    
}
    const printDocument = async() => {

	document.getElementById("refreshsig").style.visibility = "hidden";

        const divToDisplay = document.getElementById('pdfcontainer')
        document.getElementById("send").classList.add('disp')
        var HTML_Width = $("#pdfcontainer").width();
        var HTML_Height = $("#pdfcontainer").height();
        var top_left_margin = 15;
        var PDF_Width = HTML_Width + (top_left_margin * 2);
        var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
        var canvas_image_width = HTML_Width;
        var canvas_image_height = HTML_Height;

        await html2canvas(divToDisplay).then(function (canvas) {
            canvas.getContext('2d');

            console.log(canvas.height + "  " + canvas.width);

            const divImage = canvas.toDataURL("image/jpeg", 1.0);
            const pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);



            pdf.addImage(divImage, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
            pdf.save("Prescription"+patientId+".pdf");
        })
        document.getElementById("send").classList.remove('disp')
        

	document.getElementById("refreshsig").style.visibility = "visible";
    };
	const send = async () => {
        
    //    sendMail("C:/Users/vaishaali/Downloads", patientId);
    var obj = {};
        var trans;
        Object.entries({ value1 }).forEach(([key, value]) => {
            trans = String(value);
        });
        if (text !== "") {
            obj['data'] = String(text);
        }
        else {
            obj['data'] = trans;
        }
        const json = JSON.stringify(obj);
        console.log(json);
          let res = await axios.post('https://voice-fastapi.herokuapp.com/pdf', json,{
                headers: {
                    'content-type': 'application/json'
                  }
            });
            
            let result1 = res.data;
            console.log(result1); 
            
                const patientdetails={displayEmail,displayName,result1}
                const PdfRes=await axios.post("https://voice-prescription-ai.herokuapp.com/doctor/sendpdf",patientdetails);
                Swal('Email','Email Sent Successfully!!!','success');
    
    }
    //open preview view of prescription
    const handleShow = async () => {
       
        var obj = {};
        var trans;
        Object.entries({ value1 }).forEach(([key, value]) => {
            trans = String(value);
        });
        if (text !== "") {
            obj['data'] = String(text);
        }
        else {
            obj['data'] = trans;
        }
        const json = JSON.stringify(obj);
        console.log(json);
        let res = await axios.post('https://voice-fastapi.herokuapp.com/pdf', json,{
            headers: {
                'content-type': 'application/json'
              }
        })

        let result1 = res;
        const data = result1.data
        console.log((result1.data).length)
        // result1 = JSON.stringify(eval("(" + result1 + ")"));
        // var obj = JSON.parse(result1)
        // console.log(obj.item);
        // createTable(result1);
        setShow(true);
        createTable(data);



    }




    useEffect(() => {
        const getDetails = async () => {
        //    console.log(doctorId)
              const res = await Axios.get("https://voice-prescription-ai.herokuapp.com/users/info?patientId="+ patientId); 
              console.log(res.data)
              setDisplayName(res.data.displayname);
              setDisplayEmail(res.data.email);
          }   
        const getInfo = async () => {
        //    console.log(doctorId)
              const res = await Axios.get("https://voice-prescription-ai.herokuapp.com/doctor/info?doctorId="+ doctorId); 
              console.log(res.data)
              setDoctorName(res.data.firstname + " " + res.data.lastname);
          }     
        if (finalTranscript !== '') {
            // User has finished speaking, so add speech to the input

            setValue1(finalTranscript)
            // Create a fresh transcript to avoid the same transcript being appended multiple times
            //resetTranscript()
        }
        getDetails()
        getInfo()
    }, [finalTranscript, resetTranscript])
    function addRow() {
        console.log(currentRow)
        document.getElementById("R" + String(currentRow + 1)).classList.remove("disp");
        document.querySelector("#R" + String(currentRow + 1) + " td").innerHTML = "&#8226";
        setCurrentRow(currentRow + 1)

    }


    function deleteRow(e) {
        const parentDiv = e.target.parentNode;
        parentDiv.parentNode.classList.toggle('disp');

    }

    const message = async (e) => {
        e.preventDefault();
        divRef.current.scrollIntoView({ behavior: "smooth" });
        setIsBackgroundBlue(true);
        setIsBorder(true);
        setLoading(true);
        console.log("hi");
        try {
            var obj = {};
            var trans;
            Object.entries({ value1 }).forEach(([key, value]) => {
                trans = String(value);
            });
            if (text !== "") {
                obj['data'] = String(text);
            }
            else {
                obj['data'] = trans;
            }
            console.log(obj);
            const json = JSON.stringify(obj);
            console.log(json);
            let res = await axios.post('https://voice-fastapi.herokuapp.com/data', json,{
                headers: {
                    'content-type': 'application/json'
                  }
            });
            
            let result1 = res.data;
            console.log(result1);
            result1 = JSON.stringify(eval("(" + result1 + ")"));
            obj = JSON.parse(result1)
            console.log(typeof (obj.item));
            Object.entries(obj.item).forEach(([key, value]) => {
                console.log('response:', value);
            });

            var l;
            result1 = obj.item;
            console.log(obj.item.length)
            let mresult = "<div class='entities' id='div-mark' style='line-height: 2.5em; direction: ltr;'>"
            for (l = 0; l < result1.length; l++) {
                let i = result1[l].data
                let j = result1[l].label
                console.log(typeof i)
                if (j === 'O') {
                    mresult += "<mark class='entity' id='mark-id-text' style='background: #ccf2f4; line-height: 2em; border-radius: 0.78em; text-size: 1rem;'>"
                    mresult += i
                    mresult += "</mark>"
                }
                else {
                    if (j === "ADE")// red
                        mresult += "<mark class='entity' style='background: #fa1e0e;"
                    else if (j === "REASON")//purpule
                        mresult += "<mark class='entity' style='background: #a685e2;"
                    else if (j === "DRUG")// orange
                        mresult += "<mark class='entity' style='background: #ffa45b;"
                    else if (j === "FORM")// yellow capsule
                        mresult += "<mark class='entity' style='background: #fed049;"
                    else if (j === "ROUTE")// brown
                        mresult += "<mark class='entity' style='background: #bd9354;"
                    else if (j === "DOSAGE")// 1 blue
                        mresult += "<mark class='entity' style='background: #51c2d5;"
                    else if (j === "STRENGTH")// mg green
                        mresult += "<mark class='entity' style='background: #96bb7c;"
                    else if (j === "DURATION")// turtoise
                        mresult += "<mark class='entity' style='background: #cee397;"
                    else if (j === "FREQUENCY")// pink
                        mresult += "<mark class='entity' style='background: #f8a1d1;"
                    mresult += "padding: 0.45em 0.6em; border-radius: 0.35em; line-height: 2em;' id='mark-id-ann'>"
                    mresult += result1[l].data
                    mresult += "<span id='spanann' style='font-size: 0.8rem; font-weight: bold; line-height: 1em; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; color: #FFFFFF;'>"
                    mresult += result1[l].label
                    mresult += "</span></mark>"

                }
            }

            mresult += "</div>"

            setLoading(false);
            setResult(mresult);

        }
        catch (e) {
            console.log(e)
        }


    };


    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return null;
    }

    const listenContinuously = () => {
        if (buttonText === "START") {
            SpeechRecognition.startListening({
                continuous: true,
                language: 'en-GB',
            });
            setValue1({ transcript })
            setButtonText("STOP");
        }
        else {
            SpeechRecognition.stopListening();
            setButtonText("START")
        }

    };


    const RecordVoiceFunc = () => {
        return (
            <>
                <div className="form-group row" style={{ marginBottom: "0px" }}>
                    <label htmlFor="ehrText" id="labelall" className="col-sm-8 col-form-label"
                        style={{ color: "#ff7171", fontWeight: "bold" }}>Record your Voice</label>
                </div>
                <div className="form-group">
                    <textarea type="text" className="form-control" id="textarea-ID" rows="8" placeHolder="Type here..." value={value1} onChange={(e) => setValue1(e.target.value)}></textarea>
                </div>
                <div className="form-group">
                    <button className="btn btn-outline-info btn-lg btn-block" id="recordbtn" type="button"
                        onClick={listenContinuously}>{buttonText}</button>
                </div>
            </>
        );
    }

    const SelectFileFunc = () => {
        return (
            <div className="form-group row">
                <label htmlFor="ehrFile" id="labelall" className="col-sm-3 col-form-label" style={{ color: "#ff7171", fontWeight: "bold" }}>  Upload Text Format Prescription</label>

                <div className="col-sm-8">
                    <input type="file" className="upload" id="ehrFile" accept=".txt,application/text"
                        onChange={async e => {
                            const reader = new FileReader();
                            reader.onload = function () {
                                var text1 = reader.result;
                                console.log(text1);
                                setText(String(text1));
                            };
                            reader.readAsText(e.target.files[0]);
                        }} />
                </div>
            </div>
        );

    }




    const Annotationsection = () => {
        return (
            <>
                <div data-aos="fade-up" >
                    <section className={isBackgroundBlue ? 'background-blue' : 'background-none'}>
                        <div className="container" id="borderdiv" style={isBorder ? borderstyle : bordernone} data-aos="zoom-out-up">
                            <div className="content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(result) }}></div>
                        </div>
                    </section>
                    <div class="preview container">
			<br/>
			<button type="button" class="btn btn-success" id="previewbtn" onClick={handleShow}> Show Preview</button>
                    </div>
	

                    <Overlay  className="overlay overlay-body" id="overlay-body "  style={{backgroundColor: "white"}}  open={show}  onClick={close}>

                        <div className=" container" id="pdfcontainer">
                            <div className="title">
                            <h6 style={{'background-color': '#007bff','marginBottom':'4vw'}}>{"Medi+"}</h6>
                            </div>
                             
                            <form class="form-inline patientdetails" style={{'margin-left':'0.5rem'}}>
				<label for="inlineFormEmail">Doctor Name:</label>{"  "+doctorName}
                                
				<label for="inlineFormPassword" style={{'margin-left':'22vw'}}>Patient Name: </label>{"  "+displayName}
                                
                                <label for="inlineFormEmail" style={{'margin-left':'15vw'}}>Patient Email: </label>{"  "+displayEmail}
                            
                            </form>
				
                            <form class="form-inline patientdetails">
                                <label for="inlineFormEmail" class="m-2">Date:</label>
				<input id="dateRequired" type="date" name="dateRequired" defaultValue={date} style={{marginRight:"135px"}}/> 
                                
                                
				<br/><br/>
                            </form>
			    <h4 id="h3divider"></h4>
                            <div class="tableMainDiv">
                                <table align="center" id="resultTable">
                                    <tr>
                                        <th></th>
                                        <th>Drug</th>
                                        <th>Duration</th>
                                        <th>Strength</th>
                                        <th>Route</th>
                                        <th>Form</th>
                                        <th>Dosage</th>
                                        <th>Frequency</th>
                                        <th>  </th>
                                    </tr>
                                    <tr id="R1" class="disp">
                                        <td></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA1">NA </textarea> </span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA2">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA3">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA4">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA5">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA6">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA7">NA </textarea></span></td>
                                        

                                    </tr>
                                    <tr id="R2" class="disp">
                                        <td></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA1">NA </textarea> </span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA2">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA3">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA4">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA5">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA6">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA7">NA </textarea></span></td>
                                       

                                    </tr>
                                    <tr id="R3" class="disp">
                                        <td></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA1">NA </textarea> </span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA2">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA3">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA4">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA5">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA6">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA7">NA </textarea></span></td>
                                        

                                    </tr>
                                    <tr id="R4" class="disp">
                                        <td></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA1">NA </textarea> </span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA2">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA3">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA4">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA5">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA6">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA7">NA </textarea></span></td>
                                        
                                    </tr>
                                    <tr id="R5" class="disp">
                                        <td></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA1">NA </textarea> </span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA2">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA3">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA4">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA5">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA6">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA7">NA </textarea></span></td>
                                        

                                    </tr>
                                    <tr id="R6" class="disp">
                                        <td></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA1">NA </textarea> </span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA2">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA3">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA4">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA5">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA6">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA7">NA </textarea></span></td>
                                       
                                    </tr>

                                    <tr id="R7" class="disp">
                                        <td></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA1">NA </textarea> </span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA2">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA3">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA4">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA5">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA6">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA7">NA </textarea></span></td>
                                        

                                    </tr>

                                    <tr id="R8" class="disp">
                                        <td></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA1">NA </textarea> </span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA2">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA3">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA4">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA5">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA6">NA </textarea></span></td>
                                        <td><span class="dragdrop" draggable="true"><textarea id="TA7">NA </textarea></span></td>
                                       

                                    </tr>
                                </table>

                                
                                <div className="doctor-singnature">
                                    <h6>{"Dr. "+doctorName}</h6>
				    <div class='inputWithButton'>
		                            <SignaturePad
		                                clearButton="true"
		                                ref={sigCanvas}
		                                canvasProps={{
		                                    className: "signatureCanvas"
		                                }}
		                            />
					    <i class="fas fa-redo-alt" id="refreshsig" onClick={handleClear} style={{ color: "#6598d9", paddingRight: "2px", paddingTop: "2px"}}></i>
				    </div>
                                </div>
                            </div>
			    <br/>
			    <br/>
                            <footer class="overlayfooter" style={{'margin-top':'10vw'}}>
				   

				<div class="two">
                                <button type="button" class="btn btn-primary" id="send" onClick={printDocument} >
                                    Generate 
                                 </button>
                                 <button type="button" class="btn btn-primary" id="send" onClick={send} >
                                    Send 
                                 </button>
                                <button type="button" class="btn btn-primary" onClick={handleClose}>
                                    Close
                              </button>
			      </div>
                            </footer>

                        </div>




                    </Overlay>


                </div>


            </>


        );
    }

    return (
        <>
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
            <section id="prescribe">
                <div className="container">
                    <form>
                        {SelectFileFunc()}
                        <div className="form-group row" data-aos="zoom" style={{ fontWeight: "bold" }}>
                            <label className="col-sm-2 col-form-label">OR</label>
                        </div>
                        {RecordVoiceFunc()}
                        <br />
                        <div className="form-group" ref={divRef}>
                            {!loading && (<button className="btn btn-outline-danger mr-2" id="processbtn" onClick={message}>
                                Process</button>)}
                            {loading && (<button className="btn btn-outline-danger mr-2" id="processbtn" disabled><FaSpinner
                                icon="spinner" className="spinner" /> Loading...</button>)}

                        </div>
                    </form>
                </div>
            </section>
            {Annotationsection()}
        </>
    );
    }



