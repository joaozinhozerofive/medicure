
import styles from './style.module.scss'
import Image from 'next/image'
import ImgDoctor from '../../../public/medicogeneric.jpg'
import { IoIosArrowDown, IoIosArrowUp  } from "react-icons/io";
import { TbPointFilled } from "react-icons/tb";
import { BsFillTriangleFill } from "react-icons/bs";
import { useState, useEffect } from 'react';
import {PeopleProps, useDoctor} from '../../hooks/DoctorContext'
import { api } from '@/services/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/AuthContex';



interface DoctorListProps {
    className? : string
}

export default function DoctorList({className}: DoctorListProps) { 
    const [listIsOpen, setListIsOpen] = useState<boolean>(false)

    const {doctor : doctorSelected, changeDoctor} = useDoctor();

    const [doctors, setDoctors] = useState<PeopleProps[]>()

    const {update} = useAuth()


    const router = useRouter()
    const {id} = router.query
    
    const currentPath = router.asPath

    const newScheduling = currentPath === '/newScheduling'
    const editScheduling = currentPath === `/editScheduling/${id}`
    const appoiments = currentPath === '/appoiments'
    const newTime = currentPath === '/newTime'
    const editTime = currentPath === `/editTime/${id}`


  useEffect(() => {
      
      async function fetchDoctors(){

          try {
              const response =  await api.get(`/doctors`)

              const data = response.data
  
              setDoctors(data)

              if(appoiments){
                changeDoctor(data[0])
              }


          }catch(error) {
              toast.error(error.response.data.message, {
                  duration : 2000
              })
          }
      }

      fetchDoctors()
      
  }, [update])


  useEffect(() => {

    function verifyRoute(){
       
        if(newScheduling || editScheduling || newTime || editTime){
            setListIsOpen(false)
        }
    }

    verifyRoute()

  }, [])

    function toggleList(){

        if(newScheduling || editScheduling || newTime || editTime){
            return
        }
        

        setListIsOpen(listIsOpen => !listIsOpen)

    }
    async function setDoctorSelected(doctor : PeopleProps){
        
        changeDoctor(doctor)
        
        setListIsOpen(listIsOpen => !listIsOpen)
    }



    return (
        <div className={`${styles.doctorListContainer} ${className}`}>

            
            
                <div 
                onClick={() => toggleList()}
                className={styles.selectedDoctor}>

                    
                <img 
                className={styles.doctorImage}
                src={`${api?.defaults?.baseURL}/files/${doctorSelected?.img}`} 
                alt="Imagem do médico" />
                    

                    <h2>
                        {doctorSelected?.name }
                    </h2>

                    <TbPointFilled
                    size={25}
                    color='limegreen' />


                    {
                        listIsOpen ? 
                        <IoIosArrowUp
                        size={20}
                        color='gray'
                        />
                        : 
                        <IoIosArrowDown 
                        size={20}
                        color='gray' />
                    }
                

                </div>




                <div className={listIsOpen ? `${styles.list}` : `${styles.hidden}`}>

                <BsFillTriangleFill 
                className={styles.triangle}
                 />

               {
                doctors && doctors.map((doctor) => (

                    <main key={doctor.id}>

                    <div
                     onClick={() => setDoctorSelected(doctor)}
                    >

                    <img
                    className={styles.doctorImage}
                    src={`${api?.defaults?.baseURL}/files/${doctor.img}`} 
                    alt="Imagem do médico" />

                    <h2>
                        {doctor.name}
                    </h2>

                    <TbPointFilled 
                    size={25}
                    color='limegreen' />

                    </div>


                </main>
                    
                ))
               }  

                    
               

                    


                </div>




            

            
            
        </div>
    )

}