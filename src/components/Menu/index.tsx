import styles from './style.module.scss'
import { IoIosAlarm } from "react-icons/io";
import { MdPeopleAlt } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { IoCalendarSharp } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { LiaTimesSolid } from "react-icons/lia";
import { useState } from 'react';
import { RiAccountPinBoxLine } from "react-icons/ri";
import Router, { useRouter } from 'next/router';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/hooks/AuthContex';



export default function Menu(){ 
    const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false)
   const routes = useRouter()
   const {signOut} = useAuth()



    function toggleMenu() {
        setMenuIsOpen(menuIsOpen => !menuIsOpen)
    }

    function pathNameIncludes(path : string ){

        const pathIsIncludes : boolean = routes.pathname.includes(path)


        return pathIsIncludes
     }



    return(
        <div className={styles.menuContainer}>

            <div
             onClick={() => toggleMenu()}
             className={styles.toggleMenu}>

            
               { menuIsOpen ? <LiaTimesSolid /> : <RxHamburgerMenu/> }
                

            </div>

        

            
        <main
        className={menuIsOpen ? `` : `${styles.hidden}`}

        >

            <div 
            className={pathNameIncludes('appoiments') ? styles.selectedMenu : ""}
            onClick={() => Router.push('/appoiments')}>
                
            <IoIosAlarm
            className={styles.icon}
             />
            Compromissos

            </div>

            <div 
            className={pathNameIncludes('patients') ? styles.selectedMenu : ""}
            onClick={() => Router.push('/patients')}>
            <MdPeopleAlt 
            className={styles.icon}

             /> 

            Pacientes

            </div>

            <div 
            className={pathNameIncludes('doctors') ? styles.selectedMenu : ""}
            onClick={() => Router.push('/doctors')}>

            <FaUserDoctor 
            className={styles.icon}
            />

            Doutores

            </div>

            <div 
            className={pathNameIncludes('calendar') ? styles.selectedMenu : ""}
            onClick={() => Router.push('/calendar')}>
            <IoCalendarSharp
            className={styles.icon}
             />

            Calendário

            </div>

            <div 
            className={pathNameIncludes('profile') ? styles.selectedMenu : ""}
            onClick={() => Router.push('/profile')}>

            <RiAccountPinBoxLine
            className={styles.icon}
            />

            Minha conta
            
            </div>

            <div 
            onClick={() => signOut()}>

            <FiLogOut
            className={styles.icon}
            />

            Sair
            
            </div>

        </main>

        </div>


    )
}