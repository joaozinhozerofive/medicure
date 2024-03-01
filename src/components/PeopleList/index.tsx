import styles from './style.module.scss'
import Image from 'next/image'
import doctorGeneric from '../../../public/medicogeneric.jpg'
import { FiEdit } from "react-icons/fi";
import Router from 'next/router';
import { PeopleProps } from '@/hooks/DoctorContext';
import { id } from 'date-fns/locale';
import { useAuth } from '@/hooks/AuthContex';



interface PeopleListProps{
    routeDetail : string
    routeEdit : string
    peoples : PeopleProps[]

}

function code(number : string){
    const codeFormatted = number.padStart(5, '0')

    return codeFormatted
}

export default function PeopleList({routeDetail, routeEdit, peoples} : PeopleListProps){

    return (
        <div className={styles.peopleList}>

        <table className={styles.tableDesktop}>

            <thead>
                
                        <tr>
                            <th>Código</th>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>E-mail</th>
                            <th>Telefone</th>
                            <th></th>
                            <th></th>
                        </tr>

            </thead>

                <tbody>

                    {peoples && peoples.map((people) => (
                            <tr key={people.id}>


                            <td>{code(String(people.id))}</td>
                            <td>{people.name}</td>
                            <td>{people.cpf}</td>
                            <td>{people.email}</td>
                            <td>{people.phone}</td>
                            <td 
                            onClick={() => Router.push(routeDetail.includes('patientDetail') ? `patientDetail/${people.id}` : `doctorDetail/${people.id}`)} 
                            className={styles.detail}> Detalhes 
                            </td>

                            <td
                            onClick={() => Router.push(routeEdit.includes('editPatient') ? `editPatient/${people.id}` : `editDoctor/${people.id}`)}
                             > 
                             <FiEdit color='black' />  
                             </td>

                            </tr>
                    ))}

                </tbody>
            </table>

            {peoples && peoples.map((people) => (
                 <table
                 key={people.id}
                  className={styles.tableMobile}>

                 <tbody>
                     <tr>
                         <td>{code(String(people.id))}</td>
                         <td>{people.name}</td>
                         <td>{people.cpf}</td>
                         <td
                         onClick={() => Router.push(routeEdit.includes('editPatient') ? `editPatient/${people.id}` : `editDoctor/${people.id}`)}
                         > 
                         <FiEdit color='black' />  
                         </td>
                     
                     </tr>
 
                     <tr>
                     <td>{people.email}</td>
                     <td>{people.phone}</td>
                     </tr>
                     <tr>
                         <td 
                         onClick={() => Router.push(routeDetail.includes('patientDetail') ? `patientDetail/${people.id}` : `doctorDetail/${people.id}`)}
                         className={styles.detail}> Detalhes 
                         </td>
                     </tr>
                 </tbody>
 
             </table>
            ))}


       
        

        </div>

    )
}