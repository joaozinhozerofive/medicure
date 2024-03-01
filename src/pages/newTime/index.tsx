import styles from './style.module.scss'
import Menu from '@/components/Menu'
import Header from '@/components/Header'
import TagItem from '@/components/TagItem'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { IoTimeSharp } from "react-icons/io5";
import { FaCalendar } from 'react-icons/fa6'
import { useAuth } from '@/hooks/AuthContex'
import Error401 from '@/components/Error401'
import { useDate } from '@/hooks/DateContext'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useDoctor } from '@/hooks/DoctorContext'
import { api } from '@/services/api'
import Router from 'next/router'


export default function NewTime(){

    const {data} =  useAuth();
    const {doctor} = useDoctor()
    const {changeDate, date, formattedDate} =  useDate();

    const [timetables, setTimetables] =  useState<string[]>([])
    const [newTimeTable, setNewTimetable] = useState<string>()

    const [isLoading, setIsloading] =  useState<boolean>(false)


    async function handleCreateDate(){
        setIsloading(true)
        const newDate = {
            date : formattedDate(), 
            timetables, 
            doctor_id : doctor.id
        }

        try{

            if(!formattedDate() || timetables.length < 1){
               return toast.error("Por favor, insira todos os campos para continuar")
            }

            if(newTimeTable){
                return toast.error("Você esqueceu de adiconar um horário.")
            }
            await api.post(`/dates`, newDate)


            toast.success("Data criada com sucesso!")

            Router.back()

        }catch(error){
            if(error?.response?.data?.message){
                toast.error(error.response.data.message)
            }else{
                toast.error("Não foi possível crear data. ")
            }
        }finally{
            setIsloading(false)
        }
    }



    function handleRemoveTimetable(time){
        const timetableFiltered = timetables.filter(timetable => timetable !== time)

        setTimetables(timetableFiltered)
    }


    function handleNewTimetable(){
        if(!newTimeTable){
            toast.error("Você não tem nenhum horário para adionar")
        }

        handleRemoveTimetable(newTimeTable)
        setTimetables(timetable => [...timetable, newTimeTable])
        setNewTimetable('')
    }


    function handleKeyDown(e){
        if(e.key === 'Enter'){
            handleNewTimetable()
        }
    }


    if(data?.token?.length < 1 || !data?.user  ){
        return(
          <Error401 />
        )
      }


    return(
        <div className={styles.newTimeContainer}>

            <Menu />
            <Header />


            <div className={styles.content}>

                <h2>Nova agenda <IoTimeSharp color='black' /> </h2>

                <form>

                <label
                className={styles.calendar}
                htmlFor="calendar">

                    Data


                <Input
                onChange={(e) => changeDate(e)}
                id="calendar"
                type="date"
                placeholder="27/01/2023"
                icon={FaCalendar}
              />

              
          </label>

          <label>

                {timetables && timetables.map((timetable, index) => (
                <TagItem
                onClick={() => handleRemoveTimetable(timetable)}
                value={timetable}
                key={`${timetable}=${index}`}
                 />

                ))}
                <TagItem
                value={newTimeTable}
                onClick={() => handleNewTimetable()}
                onChange={(e) => setNewTimetable(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)}
                 isNew 
                 />


            </label>

            

                </form>

                <Button
                className={styles.save}
                onClick={() => handleCreateDate()}
                isLoading = {isLoading}
                title='Salvar'
             />
                
            </div>
        </div>
    )
}