import styles from '../styles/style.home.module.scss'
import Input from '@/components/Input'
import Logo from '@/components/Logo'
import { MdEmail } from 'react-icons/md'
import { GiLockedBox } from 'react-icons/gi'
import Button from '@/components/Button'
import { useAuth } from '@/hooks/AuthContex'
import { useState } from 'react'

export default function SignIn(){
    const {signIn} = useAuth()
    const [email,setEmail] = useState<string>()
    const [password,setPassword] = useState<string>()
    const [isLoading,setIsLoading] = useState<boolean>(false)

     const login = () => {
        setIsLoading(true)

        signIn({email, password})

        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    }


    return(

        <div className={styles.signInContainer}>
            <Logo />

            <Input
            onChange={e => setEmail(e.target.value)}
            className={styles.input}
            icon={MdEmail}
            type='email'
            placeholder='email@gmail.com'
             />
            <Input
            onChange={e => setPassword(e.target.value)}
            className={styles.input}
            icon={GiLockedBox}
            type='password'
            placeholder='******'
             />

            <Button
            isLoading = {isLoading}
            onClick={() => login()}
            className={styles.button}
            title='Entrar'
             />

        </div>
    )
}