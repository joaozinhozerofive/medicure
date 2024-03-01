import styles from './style.module.scss'
import PeopleList from '@/components/PeopleList'
import Input from '@/components/Input'
import Menu from '@/components/Menu'
import Header from '@/components/Header'
import { FaPlus } from "react-icons/fa6";
import Button from '@/components/Button';
import { MdPeopleAlt } from "react-icons/md";
import Router from 'next/router'
import Error401 from '@/components/Error401'
import { useAuth } from '@/hooks/AuthContex'
import { GetServerSideProps } from 'next'
import { PeopleProps } from '@/hooks/DoctorContext'
import { api } from '@/services/api'
import { useEffect, useState } from 'react'
import { useSearch } from '@/hooks/SearchContext'
import toast from 'react-hot-toast'

interface PeopleServerSideProps{
  people : PeopleProps[]
}


export default function Patients(){
  const {search} = useSearch()
  const {data} =  useAuth();

  const [patients, setPatients] = useState<PeopleProps[]>()


  useEffect(() => {
    async function fetchPatients(){
      try{

          const response =  await api.get(`/patients?name=${search}`)
          const data = response.data
  
          setPatients(data)
  
      }catch(error){
        if(error.response.data.message){
          toast.error(error.response.data.message)
        }else{
          toast.error("Não foi possível concluir esta requisição")
        }
      }
    }

    fetchPatients()
  },[search] )


    if(data?.token?.length < 1 || !data?.user  ){
        return(
          <Error401 />
        )
      }
    return (

        <div className={styles.patientsContainer}>

            <Menu/>
            <Header />

            <div className={styles.content}>

            <main>

            <h2>Pacientes 
            <MdPeopleAlt color='black'/> 

            <Button
            onClick={() => Router.push("/newPatient")}
            title='Paciente'
            icon={FaPlus}
             />
             
             </h2>

             <PeopleList
              peoples={patients}
              routeDetail= '/patientDetail'
              routeEdit='/editPatient/'
             />
            

            </main>
                

            </div>

        </div>
        


    )
}


