import styles from './style.module.scss'
import Menu from '@/components/Menu'
import Header from '@/components/Header'
import { GrScheduleNew } from "react-icons/gr";
import Input from '@/components/Input';
import { FaBarcode } from "react-icons/fa";
import { BsPeople } from 'react-icons/bs';
import { ChangeEvent, InputHTMLAttributes, useEffect, useState } from 'react';
import { FaCalendar } from 'react-icons/fa6';
import { FaCheck } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import Button from '@/components/Button';
import Error401 from '@/components/Error401';
import { useAuth } from '@/hooks/AuthContex';
import { useDate } from '@/hooks/DateContext';
import { PeopleProps, useDoctor } from '@/hooks/DoctorContext';
import toast from 'react-hot-toast';
import { api } from '@/services/api';
import Router from 'next/router';


export interface TimeTableProps{
    id? : number
    timetable : string
}

export default function NewScheduling(){

    const {data} =  useAuth();
    const {doctor} = useDoctor()


    const {formattedDate, date, changeDate, emptyDate} = useDate()
    const [timetables, setTimetables]  = useState<TimeTableProps[]>()
    const [timetable, setTimetable] = useState<string>()

    const [listIsOpen, setLisIsOpen] = useState<boolean>(false)

    const [patients, setPatients] = useState<PeopleProps[]>()
    const [patientSelected, setPatientSelected] = useState<PeopleProps>()
    const [search, setSearch] = useState<string>()


    const [patientCode, setPatientCode] = useState<string>()
    const [observation, setObservation] = useState<string>()

    const [isLoading, setIsloading] = useState<boolean>(false)


    useEffect(() => {
        function setDate(){
            console.log(formattedDate())
        }
        setDate()

    }, [formattedDate()])

    useEffect(() => {
        async function fetchPatients(){
          try{

            if(search){
                const response =  await api.get(`/patients?name=${search}`)
                const data = response.data
        
                setPatients(data)
            }else{
                const response =  await api.get(`/patients`)
                const data = response.data
        
                setPatients(data)
            }
    
              
      
          }catch(error){
            if(error.response.data.message){
              toast.error(error.response.data.message)
            }else{
              toast.error("Não foi possível concluir esta requisição")
            }
          }
        }
    
        fetchPatients()
      },[search, patientCode] )

    useEffect(() => {

        async function fetchTimeTables(){

                    if(date  && doctor) {
                        const response = await api.get(`/hourly?date=${formattedDate()}&doctor_id=${doctor?.id}`)
                        const data = response.data
        
                        setTimetables(data)
                    }
        }

        fetchTimeTables()

    },[date, doctor, formattedDate])

    function changePatientSelected(patient : PeopleProps){
        setPatientSelected(patient)
        setLisIsOpen(listIsOpen => !listIsOpen)

        setSearch(patient.name)
        setPatientCode(String(patient?.id))
    }

    function changeSearch(e : ChangeEvent<HTMLInputElement>){
        setSearch(e.target.value)
        setLisIsOpen(listIsOpen => !listIsOpen)
        
    }

    function fetchPatientWithCode(){

        const patientsFiltered = patients.filter(patient => patient.id === Number(patientCode) )

        setPatientSelected(patientsFiltered[0])

        setSearch(patientsFiltered[0]?.name)

        setLisIsOpen(false)

        console.log(patientSelected)
    }

    function handleKeyPressInputCode(e : React.KeyboardEvent<HTMLInputElement> ){
        if(e.key === 'Enter' || e.key === 'Tab'){
            fetchPatientWithCode()
        }
    }


    async function consultationCreate(){

        if(!patientCode || !patientSelected.name || !date || !timetable || !observation){
            return toast.error('Preencha todos os campos.')
        }

        setIsloading(true)

        try{

            const patient_id = Number(patientCode)

            const consultation = {
                date : formattedDate(), 
                patient_id, 
                doctor_id : doctor.id, 
                finished : false, 
                timetable , 
                observation
            }

            await api.post(`/consultations`, consultation)
            Router.push('/appoiments')

        }catch(error){
            if(error?.response?.data?.message){
                toast.error(error.response.data.message)
            }else{
                toast.error('Não foi possível completar esta requisição.')
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
        <div className={styles.newSchedulingContainer}>

            <Menu />
            <Header />


            <div className={styles.content}>


                    <h2> Novo agendamento <GrScheduleNew color='black' /> </h2>


                    <form>

                    <div>

                            <label 
                            className={styles.code}
                            htmlFor="code">
                            
                            Código 

                            <Input 
                            value={patientCode}
                            onChange={e => setPatientCode(e.target.value)}
                            onKeyDown={(e) => handleKeyPressInputCode(e)}
                            className={styles.input}
                            icon={FaBarcode }
                            placeholder='121'
                            id='code'
                            />


                            </label>
                            
                            <label
                            className={styles.name}
                            htmlFor="name">
                                
                                Paciente

                                <Input
                                value={search} 
                                onChange={e => changeSearch(e)}
                                className={styles.input}
                                icon={BsPeople}
                                placeholder='Fulano da Silva'
                                id='name'
                                type='text'
                                />


                                {listIsOpen ? (
                                    <div className={  styles.list }>

                                    {patients && patients.map(patient => (

                                        <div
                                        onClick={() =>  changePatientSelected(patient)} 
                                        key={String(patient.id)}>
                                            
                                        <p>{patient.name}</p>

                                        </div>
                                    ))}


                                </div>
                                ) : ""}

                            </label>

                    </div>

                    <div className={styles.date}>

                        <label htmlFor="calendar">

                         Data   

                        <Input
                        onChange={e => changeDate(e)}
                        className={styles.input}
                        id="calendar"
                        type="date"
                        placeholder="27/01/2023"
                        icon={FaCalendar}
                        />

                        
                        </label>

                        <label htmlFor="time">

                         Horário   

                        <Input
                        value={timetable?.length > 0 ? timetable : ""}
                        className={styles.input}
                        readOnly = {true}
                        id="time"
                        type="text"
                        icon={FaClock}
                        />

                        
                        </label>
                        

                    </div>

                    <div className={styles.times}>
                        Horários disponíveis

                        <ul>
                            {timetables?.length > 0 ?  timetables.map(time => (
                                <li key={String(time.id)}>
                                    {time?.timetable}
                                <FaCheck 
                                onClick={() => setTimetable(time.timetable)}
                                color={timetable === time.timetable ? 'limegreen' : 'gray' } />
                            </li>
                            ))
                            : <h1>Nenhum horário disponível para esta data</h1>
                        }

                        </ul>

                    </div>

                    <div>

                    <label>

                        Observações

                        <textarea 
                        value={observation}
                        onChange={e => setObservation(e.target.value)}
                        placeholder='Escreva aqui alguma observação para esta consultas'></textarea>

                    </label>


                    </div>

                    <Button 
                    isLoading = {isLoading}
                    onClick={() => consultationCreate()}
                    title='Salvar Agendamento' />
                    

                    </form>


            </div>

        </div>
    )
}