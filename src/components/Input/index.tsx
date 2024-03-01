import React, {InputHTMLAttributes } from 'react';
import styles from './style.module.scss'
import { IconType } from 'react-icons';
import InputMask from 'react-input-mask';



interface InputProps extends InputHTMLAttributes<HTMLInputElement>{ 
    icon?: IconType, 
    id ? : string
    isLoading? : boolean,
    className? : string,
    mask? : string
}




export default function Input({icon : Icon, id, isLoading, className, mask, ...rest} : InputProps){
    return(

        <label
        htmlFor={id}
        className={`${styles.input} ${className} `} >
            
            {Icon && <Icon color='black' size={15} />}

            <InputMask
            {...rest}
             id={id}
             mask={mask}
             />


        </label>

        
    )
}