import React, {createContext, useEffect, useContext, ReactNode, useState, ChangeEvent} from 'react'
import { api } from '@/services/api'
import toast from 'react-hot-toast'
import Router from 'next/router'
import { ProviderProps } from '@/interfaces/providers'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'; 



export interface UserProps{
    id : number
    name:  string
    email : string
    office : string
}

interface SignInProps{
    email : string 
    password : string
}

interface DataProps{
    token? : string
    user? : UserProps
}

interface AuthContextProps {
    data : DataProps
    signIn : (credentials : SignInProps) => Promise<void>
    signOut : () => void
    changeUpdate :() => void
    update : boolean
}




export const AuthContext = createContext({} as AuthContextProps)


export function AuthProvider({children} : ProviderProps){
    
    const [data, setData] = useState<DataProps>()

    const [update, setUpdate] = useState<boolean>()


    function changeUpdate(){
        setUpdate(update => !update)
    }


    async function signIn({email, password}: SignInProps){

        try{

            const response = await api.post('/auth', {email, password})

            const {token, user} : DataProps  = response.data

            const user_id = user.id


            if(user && token){
                Router.push(`/appoiments`)


                localStorage.setItem("@medicure:user", JSON.stringify(user))
                localStorage.setItem("@medicure:token", (token))
            }


            setData({
                token, 
                user
            })


            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            toast.success("Seja bem vindo!")

        }catch(error){
            if(error.response.data.message){
                toast.error(error.response.data.message)
            }else{
                toast.error("Ixi... Alguma coisa errada")
            }
        }
    }
    

    function signOut(){
        try{
            confirmAlert({
                title: 'Confirmação',
                message: 'Tem certeza de que deseja sair?',
                buttons: [
                  {
                    label: 'Sim',
                    onClick: () => {Router.push("/")

                    setData({})
                    localStorage.removeItem("@medicure:user")
                    localStorage.removeItem("@medicure:token")},
                  },
                  {
                    label: 'Não',
                    onClick: () => {return},
                    
                  },
                ],
                keyCodeForClose : [ 27 ]
              })

        }catch{
            toast.error("Algo de errado não está certo.")
        }
    }


    return(
        <AuthContext.Provider value={{
            data, 
            signIn, 
            signOut, 
            changeUpdate, 
            update
        }}>

            {children}

        </AuthContext.Provider>
    )

}


export const useAuth = () => {
    const context = useContext(AuthContext)

    return context
}