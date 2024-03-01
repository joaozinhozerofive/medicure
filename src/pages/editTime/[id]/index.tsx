import styles from './style.module.scss'
import Menu from '@/components/Menu'
import Header from '@/components/Header'
import TagItem from '@/components/TagItem'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { IoTimeSharp } from "react-icons/io5";
import { FaCalendar } from 'react-icons/fa6'
import Error401 from '@/components/Error401'
import { useAuth } from '@/hooks/AuthContex'
import toast from 'react-hot-toast'
import { useDoctor } from '@/hooks/DoctorContext'
import { useDate } from '@/hooks/DateContext'
import { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import { api } from '@/services/api'

import { TimeTableProps } from '@/pages/newScheduling'
import { confirmAlert } from 'react-confirm-alert'


export default function EditTime(){

  const {data, changeUpdate} =  useAuth();
  const {doctor} = useDoctor()
  const {changeDate, date, formattedDate} =  useDate();

  const router = useRouter()
  const {id} = router.query

  const {dateBRFormat, dateUSAFormat} = useDate()

  const [timetables, setTimetables] =  useState<TimeTableProps[]>([])
  const [newTimeTable, setNewTimetable] = useState<string>()
  const [dateUSA, setDateUSA] = useState<string>()
  const [dateBR, setDateBR] = useState<string>()
  const [isLoading, setIsloading] =  useState<boolean>(false)

  useEffect(() => {

    function newDateBRFormat(){
        if(dateUSA){
            setDateBR(dateBRFormat(dateUSA))

        }else{
            return
        }
    }

    newDateBRFormat()

}, [dateUSA])


  useEffect(() => {

    async function fetchDate(){
      try{
        const response = await api.get(`/dates/${id}`)
        const data = response.data

        setTimetables(data.hourly)
        setDateUSA(dateUSAFormat(data.date))


      }catch(error){
        if(error?.response?.data?.message){
          toast.error(error?.response?.data?.message)
        }else{
          toast.error("Nâo foi possível encontrar dados para esta data")
        }
      }
    }

    fetchDate()

  }, [])


  function handleRemoveTimetable(time){
    const timetableFiltered = timetables.filter(timetable => timetable.timetable !== time)

    setTimetables(timetableFiltered)
}

function handleNewTimetable(){
  if(!newTimeTable){
      toast.error("Você não tem nenhum horário para adionar")
  }

  handleRemoveTimetable(newTimeTable)
  setTimetables(timetable => [...timetable, {timetable : newTimeTable}])
  setNewTimetable('')
}


function handleKeyDown(e){
  if(e.key === 'Enter'){
      handleNewTimetable()
  }
}


async function handleUpdateDate(){
  setIsloading(false)

  try{
    const newTimetables = timetables.map(timetable => timetable.timetable)
    
    const date = {
      date : dateBR, 
      timetables : newTimetables, 
      doctor_id : doctor.id
    }

    if(!dateBR || timetables.length < 1){
      return toast.error("Por favor, insira todos os campos para continuar")
    }

    if(newTimeTable){
      toast.error("Você esqueceu de adiconar um horário.")
    }

    await api.put(`/dates/${id}`,date )
    changeUpdate()

    toast.success("Data atualizada com sucesso")
    Router.back()
    
  }catch(error){
    if(error?.response?.data?.message){
      toast.error(error?.response?.data?.message)
    }else{
      toast.error("Não foi possível atualizar esta data")
    }
  }finally{
    setIsloading(false)
  }
}


async function handleDeleteDate(){
  setIsloading(true)
  try{
    confirmAlert({
      title: 'Confirmação',
      message: 'Tem certeza de que deseja excluir esta data?',
      buttons: [
        {
          label: 'Sim',
          onClick: async () => {
            await api.delete(`/dates/${id}`)
            Router.back()
          },
        },
        {
          label: 'Não',
          onClick: () => {return},
          
        },
      ],
      keyCodeForClose : [ 27 ]
    })

    
  }catch(error){
    if(error?.response?.data?.message){
      toast.error(error?.response?.data?.message)
    }else{
      toast.error("Não foi possível excluir esta data")
    }
  }finally{
    setIsloading(false)
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

                <h2>Editar agenda <IoTimeSharp color='black' /> </h2>

    <form>

            <label
                className={styles.calendar}
                htmlFor="calendar">
                    
                    Data

                <Input
                value={dateUSA}
                onChange={e => setDateUSA(e.target.value)}
                id="calendar"
                type="date"
                placeholder="27/01/2023"
                icon={FaCalendar}
              />

          </label>

          <label>

            {timetables && timetables.map((timetable, index) => (
              <TagItem 
                onClick={() => handleRemoveTimetable(timetable.timetable)}
                key={String(`${timetable.timetable}=${index}`)}
                value={timetable.timetable}
                className={styles.tag}
                />
            ))}

                <TagItem
                value={newTimeTable}
                onClick={() => handleNewTimetable()}
                onChange={(e) => setNewTimetable(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)}
                className={styles.newTag}
                 isNew />

          </label>

            

    </form>


            <Button
            onClick={() => handleUpdateDate()}
            isLoading={isLoading}
            className={styles.save}
            title='Salvar'
             />

            <Button
            onClick={() => handleDeleteDate()}
            isLoading={isLoading}
            className={styles.delete}
            title='Excluir'
             />
                
            </div>
        </div>
    )
}