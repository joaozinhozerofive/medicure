import styles from './style.module.scss'
import Menu from '@/components/Menu'
import Header from '@/components/Header'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { BsPeople } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import { RiComputerFill } from "react-icons/ri";
import { MdPassword } from 'react-icons/md'
import { GiPadlock } from 'react-icons/gi'
import { CgProfile } from 'react-icons/cg'
import Error401 from '@/components/Error401'
import { useAuth } from '@/hooks/AuthContex'
import { useEffect, useState } from 'react'
import { UserProps } from '@/hooks/AuthContex'
import toast from 'react-hot-toast'
import { api } from '@/services/api'



export default function Profile(){

    const {data} =  useAuth();
    const userLocalStorage = localStorage.getItem('@medicure:user')

    const [user, setUser] = useState<UserProps>()
    const [name, setName] = useState<string>()
    const [email, setEmail] =  useState<string>()
    const [office, setOffice] =  useState<string>()
    
    const [password, setPassword] = useState<string>()
    const [old_password, setOldPassword] = useState<string>()

    const [loading, setIsloading] = useState<boolean>(false)

    useEffect(() => {
        function fetchUser(){

            const response = localStorage.getItem('@medicure:user')
            const data = JSON.parse(response)

            setName(data.name)
            setEmail(data.email)
            setOffice(data.office)
        }

        fetchUser()

    }, [userLocalStorage])


    async function updateUser(){
        const user = {
            name, 
            email, 
            office, 
            password, 
            old_password 
        }

        try{
            setIsloading(true)

             await api.put(`/users`, user)

             localStorage.removeItem("medicure:user")

             localStorage.setItem("@medicure:user", JSON.stringify(user))

             toast.success("Usuário alterado com sucesso!")

        }catch(error){
            if(error?.response?.data?.message){
                toast.error(error.response.data.message)
            }else{
                toast.error("Nâo foi possível completar esta requisição")
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
        <div className={styles.profileContainer}>

        <Menu />
        <Header />


            <div className={styles.content}>
                <h1>Alteração de perfil <CgProfile color='black' />  </h1>

                <form>

                    <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className={styles.input}
                    icon={BsPeople}
                    placeholder='Nome'
                    type='text'
                     />

                    <Input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={styles.input}
                    icon={MdEmail}
                    placeholder='Email'
                    type='text'
                     />

                    <Input
                    value={office}
                    onChange={e => setOffice(e.target.value)}
                    className={styles.input}
                    icon={RiComputerFill}
                    placeholder='Cargo'
                    type='text'
                     />

                    <Input
                    value={old_password}
                    onChange={e => setOldPassword(e.target.value)}
                    className={styles.input}
                    icon={MdPassword}
                    placeholder='Senha antiga'
                    type='password'
                     />

                    <Input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={styles.input}
                    icon={GiPadlock}
                    placeholder='Nova senha'
                    type='password'
                     />

                        <Button
                        onClick={() => updateUser()}
                        isLoading = {loading}
                        title='Salvar'
                        />

                </form>

            </div>

        </div>
    )
}