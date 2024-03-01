import React, {createContext, useEffect, useContext, ReactNode, useState, ChangeEvent, SetStateAction, Dispatch} from 'react'
import { ProviderProps } from '@/interfaces/providers'
import {format} from 'date-fns'



interface DateProvider {
    date : string;
    changeDate : (credentials : ChangeEvent<HTMLInputElement>) => void
    formattedDate : () => string
    emptyDate : () => void
    dateBRFormat : (credentials : string) => string
    dateUSAFormat : (credentials : string) => string
}


export const DateContext  = createContext({} as DateProvider)


export function DateProvider({children} : ProviderProps){

    const [date, setDate] = useState<string>('') 

    const formattedDate = () => {
        const newDate = date.split("-")

        const day  = newDate[2]
        const month = newDate[1]
        const year = newDate[0]

        return `${day}/${month}/${year}`
      };

      const dateUSAFormat = (date : string) => {
        const newDate = date.split('/')

        const day = newDate[0]
        const month = newDate[1]
        const year  = newDate[2]



        return `${year}-${month}-${day}`
      }


      const dateBRFormat = (date : string) => {
                const newDate = date.split("-")
    
                const day  = newDate[2]
                const month = newDate[1]
                const year = newDate[0]
    
                return (`${day}/${month}/${year}`)
      }

    function changeDate(e?: ChangeEvent<HTMLInputElement> ){
            setDate(e.target.value)
    }

    function emptyDate(){
        setDate('false')
    }



    return(


        <DateContext.Provider value={{
            changeDate, 
            date, 
            formattedDate, 
            emptyDate, 
            dateBRFormat, 
            dateUSAFormat
        }}>

            {children}

        </DateContext.Provider>
    )

}


export const useDate = () => {
    const context = useContext(DateContext)


    return context
}






