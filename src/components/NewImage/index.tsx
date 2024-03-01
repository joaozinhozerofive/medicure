import styles from './style.module.scss'
import Image, { StaticImageData } from 'next/image'
import { FiCamera } from 'react-icons/fi'
import { InputHTMLAttributes } from 'react'

interface NewImageProps extends InputHTMLAttributes<HTMLInputElement>{
    imgSRC : string
}


export default function NewImage({imgSRC,...rest} : NewImageProps){
    return(
        <div className={styles.imagePreview}>

                    <img 
                    src=
                    {imgSRC?? 
                    'https://static.vecteezy.com/ti/vetor-gratis/p3/2387693-icone-do-perfil-do-usuario-vetor.jpg'} 
                    alt="Imagem de perfil" />

                    <div className={styles.camera}>
                    
                    <FiCamera 
                    color='white' />  

                    </div>

                    <input 
                    {...rest}
                    className={styles.inputFile}
                    name='file'
                    type="file" />

                    </div>

    )


}