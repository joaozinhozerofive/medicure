import styles from './style.module.scss'
import Menu from '@/components/Menu'
import Header from '@/components/Header'
import Image from 'next/image'
import medicoGeneric from '../../../../public/medicogeneric.jpg'
import { BsArrowUpRightSquareFill } from 'react-icons/bs'
import Button from '@/components/Button'
import Link from 'next/link'
import Error401 from '@/components/Error401'
import { useAuth } from '@/hooks/AuthContex'
import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'


export default function DoctorDetail(){

    const {data} =  useAuth()
    const router = useRouter()
    const {id} = router.query


    const [image, setImage] = useState<string>()
    const [cpf, setCpf] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [name, setName] = useState<string>()
    const [birth, setBirth] = useState<string>()
    const [office, setOffice] = useState<string>()
    const [phone, setPhone] = useState<string>()
    const [adress, setAdress] =  useState<string>()
    const [neighborhood, setNeighborhood] = useState<string>()
    const [residenceCode, setResidenceCode] =  useState<string>()
    const [observation, setObservation] =  useState<string>()


    const phoneWhatsApp = phone?.replace(/[\s()-]/g, "");


    useEffect(() => {
        async function fetchDoctor(){

            try{
                const response = await api.get(`doctors/${id}`)
                const data = response.data

                setImage(data.img)
                setCpf(data.cpf)
                setEmail(data.email)
                setName(data.name)
                setPhone(data.phone)
                setAdress(data.adress)
                setNeighborhood(data.neighborhood)
                setResidenceCode(data.residenceCode)
                setObservation(data.observation)
                setBirth(data.birth)
                setOffice(data.office)


                
            }catch(error){
                if(error?.response?.data?.message){
                    toast.error(error?.response?.data?.message)
                }else{
                    toast.error("Não foi possível encontrar dados deste médico")
                }
            }

        }

        fetchDoctor()
    })


    if(data?.token?.length < 1 || !data?.user  ){
        return(
          <Error401 />
        )
      }

    return(
        <div className={styles.doctorDetailContainer}>

            <Menu />
            <Header />

            <div className={styles.content}>

                <div className={styles.doctor}>

                    <img 
                    src={`${api?.defaults?.baseURL}/files/${image}`} 
                    alt="Imagem do paciente" />

                    <div>

                    <h1>{name}</h1>
                    <p>{birth}</p>

                    </div>
                </div>


                <div>
                    <h1>Especialidade</h1>
                    <p>{office}</p>
                    
                </div>

                <div>
                    <h1>Informações pessoais</h1>
                    
                    <h2>CPF</h2>
                    <p>{cpf}</p>
                    
                </div>

                <div>

                    <h1>Contato</h1>

                    <h2>Email</h2>
                    <p>{email}</p>

                    <h2>Telefone</h2>
                    <p>{phone}</p>

                    
                </div>

                <div>

                    <h1>Endereço</h1>
                    <p>{`${adress}, ${residenceCode}`}</p>

                    <h2>Bairro</h2>
                    <p>{neighborhood}</p>

                    
                </div>

                <div>

                    <h1>Observações</h1>
                    
                    <p>{observation}</p>
                    
                </div>

                <Link
                className={styles.contact}
                href={`https://api.whatsapp.com/send/?phone=%2B55${phoneWhatsApp}&text&type=phone_number&app_absent=0`}
                target='_blank'
                >

                <Button
                icon={BsArrowUpRightSquareFill}
                title='Entrar em contato'

                 />


                </Link>


            </div>

        </div>
    )
}