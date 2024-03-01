import styles from './style.module.scss'
import logo from '../../../public/pngwing.com.png'
import Image from 'next/image'

export default function Logo() {
    return (
        <div className={styles.logoContainer}>

        <Image
        className={styles.logoImg}
        src={logo} 
        alt="Logo da clinica" />

        <h1 
        className={styles.logoTitle}>

            MediCure.

        </h1>

        </div>
        
    )
}