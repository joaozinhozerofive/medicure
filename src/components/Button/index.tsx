import styles from './style.module.scss'
import { IconType } from 'react-icons'
import { ButtonHTMLAttributes } from 'react'


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{ 
    className? : string,
    icon?: IconType, 
    isLoading? : boolean,
    title? : string,
    onCLick? :  () => void
}



   export default function Button({icon : Icon, isLoading, className,title, ...rest} : ButtonProps){
    return(
        <button 
        {...rest}
        type='button'
        disabled={isLoading} 
        className={`${className} ${isLoading ? styles.loading :styles.buttonContainer }`} 
        >
            
            {Icon && <Icon color='white' size={10}/>}
            {isLoading ? 'Carregando...' : title }
            

        </button>
    )
}