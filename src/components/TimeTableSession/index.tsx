import Router, { useRouter } from 'next/router'
import styles from './style.module.scss'
import { FiEdit } from 'react-icons/fi'
import { DateProps } from '@/pages/calendar'

export default function TimeTableSession({date, hourly, id} : DateProps ){
    

    return(
        <div className={styles.sessionContainer}>

                <h1>{date}</h1>

                <FiEdit 
                onClick={() => Router.push(`/editTime/${id}`)}
                className={styles.edit}/>

                <ul>
                    {hourly && hourly.map((timeTable, index) => (
                    <li key={String(timeTable.id)}>
                        {timeTable.timetable}
                    </li>
                    ))}
                </ul>
        </div>
    )
}