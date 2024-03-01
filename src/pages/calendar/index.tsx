import styles from './style.module.scss'
import TimeTableSession from '@/components/TimeTableSession'
import Menu from '@/components/Menu'
import Header from '@/components/Header'
import { FaCalendarPlus } from "react-icons/fa6";
import Button from '@/components/Button';
import { FaPlus } from "react-icons/fa";
import DoctorList from '@/components/DoctorList';
import Router from 'next/router';
import Error401 from '@/components/Error401';
import { useAuth } from '@/hooks/AuthContex';
import { useDoctor } from '@/hooks/DoctorContext';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import toast from 'react-hot-toast';


export interface HourlyProps{
  id? : number
  timetable : string
  date_id? : number
}


export interface DateProps {
  id? : number
  date : string
  doctor_id? : number
  hourly : HourlyProps[]
}




export default function Calendar(){

    const {data, update} =  useAuth()
    const {doctor} =  useDoctor()
    const [dates, setDates] =  useState<DateProps[]>()


    useEffect(() => {

      async function fetchDates(){
        try{

          if(!doctor.id){
            setDates(null)

            return
          }
          

          const response = await api.get(`/dates?doctor_id=${doctor.id ?? 1}`)

          const data = response.data
          setDates(data)

        }catch(error){
          if(error?.response?.data?.message){
            toast.error(error.response.data.message)
          }else{
            toast.error("Erro ao fazer requisição")
          }
        }
      }

      fetchDates()

    }, [doctor, update])

    if(data?.token?.length < 1 || !data?.user  ){
        return(
          <Error401 />
        )
      }
    
    return(
        <div className={styles.calendarContainer}>

            <Menu />
            <Header />

            <div className={styles.content}>

            <h2>
                Calendário 
                <FaCalendarPlus color='black' />
                <Button
                onClick={() => Router.push('/newTime')}
                title='Horário'
                icon={FaPlus}
                />
                 </h2>

            <DoctorList className={styles.doctorList} />



            <div className={styles.calendarList}>


            {dates?.length > 0 ? dates.map(date => (
              <TimeTableSession
              key={String(date.id)}
              id={date.id}
              date={`${date.date}`}
              hourly={date.hourly}
               />

            )) :
            (
              <h1>Ops... Nada por aqui</h1>
            )}

            </div>
            


            </div>

        </div>
    )
}