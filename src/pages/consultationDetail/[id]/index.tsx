import styles from './style.module.scss'
import Menu from '@/components/Menu'
import Header from '@/components/Header'
import Image from 'next/image'
import medicoGeneric from '../../../../public/medicogeneric.jpg'
import { FiEdit2 } from 'react-icons/fi'
import Router, { useRouter } from 'next/router'
import Error401 from '@/components/Error401'
import { useAuth } from '@/hooks/AuthContex'
import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import toast from 'react-hot-toast'
import { PeopleProps } from '@/hooks/DoctorContext'

export default function ConsultationDetail(){

    const {data} =  useAuth()
    const router = useRouter().query
    const {id} = router

    const [patient, setPatient] = useState<PeopleProps>()
    const [date, setDate] = useState<string>()
    const [timetable, settimeTable] = useState<string>()
    const [observation, setObservation] =  useState<string>()




    useEffect(() => {

        async function fetchConsultation(){

            



            try{
                const response = await api.get(`/consultations/${id}`)
                const data = response.data


                setDate(data.date)
                settimeTable(data.timetable)
                setObservation(data.observation)
                setPatient(data.patient)


            }catch(error){
                if(error?.response?.data?.message){
                    toast.error(error?.response?.data?.message)
                }else{
                    toast.error("Não foi possível encontrar dados para esta consulta")
                }
            }

            

        }

        fetchConsultation()

    }, [id])

    if(data?.token?.length < 1 || !data?.user  ){
        return(
          <Error401 />
        )
      }


    return(
        <div className={styles.consultationDetailContainer}>

        <Menu />
        <Header />

            <div className={styles.content}>

                <div className={styles.patient}>

                    <img
                     src={`${api?.defaults?.baseURL}/files/${patient?.img}`} 
                     alt="Imagem do paciente" />

                    <h1>{patient?.name}</h1>

                    <FiEdit2 
                    onClick={() => Router.push(`/editScheduling/${id}`)}
                    className={styles.edit} />
                </div>


                

                <div className={styles.time}>

                    <h1>Data</h1>
                    <p>{date}</p>

                    <h1>Horário</h1>
                    <p>{timetable}</p>

                </div>

                <div className={styles.observation}>

                    <h1>Observação</h1>
                    <p>{observation}</p>

                </div>


            </div>
        </div>
    )
}