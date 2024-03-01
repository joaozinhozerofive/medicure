import styles from './style.module.scss'
import { FiSearch } from 'react-icons/fi'

import Logo from '../Logo'
import DoctorList from '../DoctorList'
import { useSearch } from '@/hooks/SearchContext'
import { useEffect } from 'react'

export default function Header() {
    const {changeSearch, search} = useSearch()

    return (
        <div className={styles.headerContainer}>

            <Logo />

            <div className={styles.input}>
                

                <FiSearch 
                size={15}
                color='gray'/>

                <input
                value={search}
                onChange={(e) => changeSearch(e)}
                placeholder='Pequise aqui...'
                type="text" />
            

            </div>


            <DoctorList
            className={styles.doctorList}
             />
            

        </div>
    )
}