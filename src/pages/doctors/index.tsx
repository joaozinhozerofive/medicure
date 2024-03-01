import styles from './style.module.scss'
import PeopleList from '@/components/PeopleList'
import Menu from '@/components/Menu'
import Header from '@/components/Header'
import { FaPlus } from "react-icons/fa6";
import Button from '@/components/Button';
import { FaUserDoctor } from "react-icons/fa6";
import Router from 'next/router';
import Error401 from '@/components/Error401';
import { useAuth } from '@/hooks/AuthContex';
import { PeopleProps } from '@/hooks/DoctorContext';
import { useEffect, useState } from 'react';
import { useSearch } from '@/hooks/SearchContext';
import { api } from '@/services/api';
import toast from 'react-hot-toast';



export default function Doctors(){

    const {data} =  useAuth()
    const {search} = useSearch()
    const [doctors, setDoctors] = useState<PeopleProps[]>()


  useEffect(() => {
    async function fetchPatients(){
      try{

          const response =  await api.get(`/doctors?name=${search}`)
          const data = response.data
  
          setDoctors(data)
        
        
  
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

        <div className={styles.doctorsContainer}>

            <Menu/>
            <Header />

            <div className={styles.content}>

            <main>

            <h2>
                Médicos 
                <FaUserDoctor color='black' />
                <Button
                onClick={() => Router.push("/newDoctor")}
                title='Médico'
                icon={FaPlus}
                />
            </h2>

            <PeopleList
            peoples={doctors}
            routeDetail='/doctorDetail/1'
            routeEdit='/editDoctor/1'
             />

            

            </main>
                

            </div>

        </div>
        


    )
}