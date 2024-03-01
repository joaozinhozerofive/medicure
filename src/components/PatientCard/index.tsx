import styles from './style.module.scss'
import Image from 'next/image'
import doctorGeneric from '../../../public/medicogeneric.jpg'
import { FaCheckCircle } from "react-icons/fa";
import { FaTimesCircle } from "react-icons/fa";
import Router from 'next/router';
import { ConsultationsProps } from '@/pages/appoiments';
import { api } from '@/services/api';


export default function PatientCard({patient, finished, date, timetable, id } : ConsultationsProps){

    return ( 

        <div className={styles.PatientCardContainer}>


        <div className={styles.profile}>

                    <img 
                    src={`${api?.defaults?.baseURL}/files/${patient?.img}`} 
                    alt="Imagem do paciente" />

                    <div>
                        <h1>{patient?.name}</h1>
                        <p>Consultation</p>
                    </div>
        </div>

        <div className={styles.check}>

        <FaCheckCircle
        size={22}
        color={finished  ?  'limegreen' : 'gray'}
         />   

         <FaTimesCircle 
         size={22}
         color={!finished ? 'red' : 'gray'}
         />  

        </div>    


        <div className={styles.time}>
            <h1>{timetable}</h1>
            <p>{date}</p>
        </div>



        <p onClick={() => Router.push(`/consultationDetail/${id}`)}>Ver mais</p>




    </div>

    )
}