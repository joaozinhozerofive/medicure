'use client'

import {InputHTMLAttributes, ChangeEventHandler} from 'react'
import styles from './styles.module.scss'
import { FiPlus, FiX } from "react-icons/fi"
import { Poppins } from 'next/font/google'
import Input from '../Input'



interface TagItemProps extends InputHTMLAttributes<HTMLInputElement>{
className? : string,
isNew? : boolean, 
onClick ? : () => void
}




export default function TagItem({  className, isNew, onClick, ...rest} :  TagItemProps){


    return(
        <div className={`${ isNew ? styles.isNew : styles.tagItem} ${className}`}>

            <Input 
            {...rest}
            mask='99:99'
            className={styles.input}
            readOnly = {isNew ? false : true}
            type="text"
             />




             <button type='button'>
                {isNew ? 
                    <FiPlus
                    onClick = {onClick}
                    color = 'limegreen'
                    type = 'button'/> 
                    : 
                    <FiX
                    onClick = {onClick}
                    color = 'yellow'
                    type = 'button'/>
                }


             </button>

        </div>
    )

}