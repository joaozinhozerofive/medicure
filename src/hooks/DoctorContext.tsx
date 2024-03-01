import {createContext, useContext, useEffect, useState, ReactNode} from 'react'
import { ProviderProps } from '@/interfaces/providers'
import doctorExample from '../../public/medicogeneric.jpg'
import { StaticImageData } from 'next/image'
import toast from 'react-hot-toast'
import { api } from '@/services/api'

export interface PeopleProps{
    id? : number
    img? : string 
    name : string
    cpf? : string
    email? : string
    phone? : string
    birth? : string
    zipCode? : string
    adress? : string
    neighborhood? : string
    residenceCode? : String
    observation? : string
    office? : string
}

interface DoctorContextProps{
    doctor  : PeopleProps

    changeDoctor : (credentials : PeopleProps ) => void
}


export const DoctorContext = createContext({} as DoctorContextProps )

export function DoctorProvider({children} : ProviderProps){
    

    const [doctor, setDoctor] = useState<PeopleProps>()


    function changeDoctor(doctor : PeopleProps){
        setDoctor(doctor)
    }


    return (
        <DoctorContext.Provider value={{
            changeDoctor,
            doctor
        }}>
            {children}
        </DoctorContext.Provider>
    )
}


export const useDoctor = () => {
   const context  =  useContext(DoctorContext)

   return context
} 



