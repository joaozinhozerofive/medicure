import Header from "@/components/Header";
import Menu from "@/components/Menu";
import styles from './style.module.scss'
import dynamic from "next/dynamic";
import ColumnGraphic from "@/components/ColumnGraphic";
import Input from "@/components/Input";
import DoctorList from "@/components/DoctorList";
import PatientCard from "@/components/PatientCard";
import { FaCalendar } from "react-icons/fa";
import Button from "@/components/Button";
import { FaPlus } from "react-icons/fa6";
import Router from "next/router";
import { useDate } from "@/hooks/DateContext";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/AuthContex";
import Error401 from "@/components/Error401";
import { PeopleProps, useDoctor } from "@/hooks/DoctorContext";
import Image from "next/image";
import { api } from "@/services/api";
import toast from "react-hot-toast";
const RadialGraphic = dynamic(() => import ("../../components/RadialGraphic"), {
  ssr : false
})


export interface ConsultationsProps { 
    id? : number
    date? : string
    patient_id? : number
    finished? : boolean
    timetable? : string
    observation? : string 
    patient : PeopleProps
}


export default function Appoiments() {

    const {doctor} = useDoctor();
    const {changeDate, formattedDate, date} = useDate()
    const {data} = useAuth()

    const [consultations, setConsultations] = useState<ConsultationsProps[]>()
    const [consultationsFinished, setConsultationsFinished] = useState<ConsultationsProps[]>()

  useEffect(() => {

    async function fetchConsultations(){

        if(!doctor?.id){
          setConsultations(null)

          return
        }

        const response = await api.get(`/consultations?doctor_id=${doctor.id}&date=${formattedDate()}`)
        const data = response.data

        setConsultations(data)
        setConsultationsFinished(data.filter(consultation => consultation.finished === true))
      
    }

    fetchConsultations()

  }, [doctor, formattedDate])  



  if(data?.token?.length < 1 || !data?.user  ){
    return(
      <Error401 />
    )
  }



  return (

   <div className={styles.homeContainer}>
    <Header />

    <Menu />

    <div className={styles.content}>

      <div className={styles.startContent}>

          <label
          className={styles.calendar}
           htmlFor="calendar">

            Data


              <Input
              onChange={e => changeDate(e)}
              id="calendar"
              type="date"
              placeholder="27/01/2023"
              icon={FaCalendar}
              />

              
          </label>

            
          <Button
          onClick={() => Router.push('/newScheduling')}
          title='Agendar'
          icon={FaPlus}
           />

          
      </div>

        <div>


            <RadialGraphic
            className = {consultations?.length > 0 ? "" : styles.hidden}
            appoiments={consultations?.length}
            finished={consultationsFinished?.length}
             />
            
            <ColumnGraphic
            className = {consultations?.length > 0 ? "" : styles.hidden}
            appoiments={consultations?.length}
             />

          <DoctorList className={styles.doctorList} />

        </div>

        <div>

        <h3>Neste período <span>{`(${consultations?.length > 0 ? consultations.length : 0} consultas)`}</span></h3>

        </div>

        <div className={styles.patientCard}>


      {consultations?.length > 0 ?
      consultations.map((consultation) => (
          <PatientCard 
          key={String(consultation.id)}
          patient={consultation.patient}
          date={`${consultation.date}`}
          timetable={`${consultation.timetable}`}
          finished = {consultation.finished}
          id={consultation.id}
          />
      ))
       
      : (
        <h1>Ops... Nenhuma consulta por aqui</h1>
      )
    }
        

        </div>

    </div>

   </div>
  );
}
