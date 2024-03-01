import styles from './style.module.scss'
import Menu from '@/components/Menu'
import Header from '@/components/Header'
import { GrScheduleNew } from "react-icons/gr";
import Input from '@/components/Input';
import { FaBarcode } from "react-icons/fa";
import { BsPeople } from 'react-icons/bs';
import { ChangeEvent, useEffect, useState } from 'react';
import { FaCalendar } from 'react-icons/fa6';
import { FaCheck } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import Button from '@/components/Button';
import Error401 from '@/components/Error401';
import { useAuth } from '@/hooks/AuthContex';
import { PeopleProps, useDoctor } from '@/hooks/DoctorContext';
import { useDate } from '@/hooks/DateContext';
import { TimeTableProps } from '@/pages/newScheduling';
import { api } from '@/services/api';
import toast from 'react-hot-toast';
import Router, { useRouter } from 'next/router';
import { confirmAlert } from 'react-confirm-alert';


export interface ConsultationProps{
    id : number
    patient_id: number
    finished : boolean
    date: string 
    timetable : string 
    observation : string 
    patient : PeopleProps
}

export default function EditScheduling(){


    const {data} =  useAuth();
    const {doctor} = useDoctor()
    const {dateBRFormat, dateUSAFormat} = useDate()
    const router = useRouter()
    const {id} = router.query


    const [dateBR, setDateBR] =  useState<string>()
    const [dateUSA, setDateUSA] =  useState<string>()
    const [timetables, setTimetables]  = useState<TimeTableProps[]>()
    const [timetable, setTimetable] = useState<string>()

    const [listIsOpen, setLisIsOpen] = useState<boolean>(false)

    const [patients, setPatients] = useState<PeopleProps[]>()
    const [patientSelected, setPatientSelected] = useState<PeopleProps>()
    const [search, setSearch] = useState<string>()
    const [patientCode, setPatientCode] = useState<string>()
    const [observation, setObservation] = useState<string>()

    const [isLoading, setIsloading] = useState<boolean>(false)

    const [finished, setFinished] = useState<boolean>()



    



    useEffect(() => {
        function fetchFinished(){
            console.log(finished)
        }


        fetchFinished()

    },[finished])


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

        async function fetchConsultations(){
            try{
                const response =  await api.get(`/consultations/${id}`)
                const data : ConsultationProps = response.data

                setPatientCode(String(data.patient.id))
                setPatientSelected(data.patient)
                setSearch(data.patient.name)
                setDateBR(data.date)
                setObservation(data.observation)
                setTimetable(data.timetable)
                setFinished(data.finished)

                

                setDateUSA(dateUSAFormat(data.date))


                

            }catch(error){
                if(error?.response?.data?.message){
                    toast.error(error.response.data.message)
                  }else{
                    toast.error("Não foi possível concluir esta requisição")
                  }
            }

        }

        fetchConsultations()

    }, [id])

   

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

                    if(dateBR  && doctor) {
                        const response = await api.get(`/hourly?date=${dateBR}&doctor_id=${doctor?.id}&consultation_id=${id}`)
                        const data = response.data
        
                        setTimetables(data)

                        console.log(data)
                        console.log(doctor?.id)


                    }
        }

        fetchTimeTables()

    },[doctor, dateBR, dateUSA])



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

    }

    function handleKeyPressInputCode(e : React.KeyboardEvent<HTMLInputElement> ){
        if(e.key === 'Enter' || e.key === 'Tab'){
            fetchPatientWithCode()
        }
    }

    async function updateConsultation(){
        setIsloading(true)
        try{
            const consultation = {
                date : dateBR, 
                patient_id : Number(patientCode), 
                doctor_id : doctor.id, 
                timetable, 
                finished,
                observation 
            }

            await api.put(`/consultations/${id}`, consultation)


            toast.success("Consulta atualizada com sucesso ")

        }catch(error){
            if(error?.response?.data?.message){
                toast.error(error.response.data.message)
            }else
            toast.error("Não foi possível atualizar os dados desta consulta")
        }finally{
            setIsloading(false)
        }
    }


    const removeConsultation =
    async () => {
        try{
            await api.delete(`consultations/${id}`)
            Router.push("/appoiments")
        }catch(error){
            if(error?.response?.data?.message){
                toast.error(error?.response?.data?.message)
            }else{
                toast.error("Não foi possível excluir consulta")
            }
        }
    }

   async function deleteConsultation(){
        try{
            confirmAlert({
                title: 'Confirmação',
                message: 'Tem certeza de que deseja excluir?',
                buttons: [
                  {
                    label: 'Sim',
                    onClick: () => removeConsultation()
                  },
                  {
                    label: 'Não',
                    onClick: () => {return},
                    
                  },
                ],
                keyCodeForClose : [ 27 ]
              })


        }catch{

        }
    }
    


    if(data?.token?.length < 1 || !data?.user  ){
        return(
          <Error401 />
        )
      }

    return(
        <div className={styles.editSchedulingContainer}>

            <Menu />
            <Header />


            <div className={styles.content}>


                    <h2> Editar agendamento <GrScheduleNew color='black' /> </h2>


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
                        value={dateUSA}
                        onChange={e => setDateUSA(e.target.value)}
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
                        value={timetable}
                        className={styles.input}
                        readOnly = {true}
                        id="time"
                        type="text"
                        icon={FaClock}
                        />

                        
                        </label>
                        

                    </div>


                    <label htmlFor="finished">

                    <input
                    onClick={() => setFinished(finished => !finished)} 
                    checked = {finished}
                    id='finished'
                    type="checkbox" />

                    <p>Finalizada</p>

                    </label>

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
                    onClick={() => updateConsultation()}
                    title='Salvar Agendamento' />

                    <Button 
                    onClick={() => deleteConsultation()}
                    className= {styles.delete}
                    title='Excluir Agendamento' />

                    

                    </form>


            </div>

        </div>
    )
}



