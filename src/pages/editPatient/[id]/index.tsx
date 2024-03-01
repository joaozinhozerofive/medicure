import styles from './style.module.scss'
import Menu from '@/components/Menu'
import Header from '@/components/Header'
import { MdPeopleAlt } from "react-icons/md";
import NewImage from '@/components/NewImage';
import Input from '@/components/Input';
import { BsPeople } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';
import Button from '@/components/Button';
import { FaBirthdayCake } from 'react-icons/fa';
import { BsFillPostcardFill } from "react-icons/bs";
import { FaRegAddressCard } from "react-icons/fa";
import { TbNumber } from "react-icons/tb";
import { BiPhone } from 'react-icons/bi';
import Error401 from '@/components/Error401';
import { useAuth } from '@/hooks/AuthContex';
import { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { api } from '@/services/api';


export default function EditPatient(){

    const {data} =  useAuth();
    const router = useRouter();
    const {id} = router.query

    const [imagePreview, setImagePreview] = useState<string>()
    const [img, setImg] = useState<File | undefined>()
    const [name, setName] = useState<string>()
    const [cpf, setCpf] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [phone, setPhone] = useState<string>()
    const [birth, setBirth] = useState<string>()
    const [zipCode, setZipCode] = useState<string>()
    const [adress, setAdress] = useState<string>()
    const [neighborhood, setNeightborhood] = useState<string>()
    const [residenceCode, setResidenceCode] = useState<string>()
    const [observation, setObservation] = useState<string>()

    const [isLoading, setIsLoading] =  useState<boolean>(false)



   


    useEffect(() => {

        async function fetchPatient(){
            try{
                const response = await api.get(`/patients/${id}`)
                const data = response.data


                setImagePreview(`${api?.defaults?.baseURL}/files/${data.img}`)
                setName(data.name)
                setCpf(data.cpf)
                setEmail(data.email)
                setPhone(data.phone)
                setBirth(data.birth)
                setZipCode(data.zipCode)
                setAdress(data.adress)
                setNeightborhood(data.neighborhood)
                setResidenceCode(data.residenceCode)
                setObservation(data.observation)

            }catch(error){
                if(error?.response?.data?.message){
                    toast.error(error?.response?.data?.message)
                }else{
                    toast.error("Não foi possível carregar os dados deste paciente")
                }
            }
        }

        fetchPatient()

    }, [id])

    async function HandleChangeImgPatient(e){
        const file = e.target.files[0]


        setImg(file)

        const imagePreview  = URL?.createObjectURL(file)



        setImagePreview(imagePreview)
    }



    async function handleUpdatePatient(){
        setIsLoading(true)
            
        try{
            if(img){
                const formData = new FormData()
                formData.append('file', img)

                await api.patch(`files/patient/${id}`, formData)
            }


                const patient = {
                    name, 
                    email, 
                    cpf, 
                    phone,
                    birth,
                    zipCode,
                    adress, 
                    neighborhood, 
                    residenceCode, 
                    observation
                }

                await api.put(`/patients/${id}`, patient)

                toast.success("Paciente alterado com sucesso")

                Router.back()
            

        }catch(error){
            if(error?.response?.data?.message){
                toast.error(error?.response?.data?.message)
            }else{
                toast.error("Não foi possível atualizar os dados deste paciente")
            }
        }finally{
            setIsLoading(false)
        }
    }





    if(data?.token?.length < 1 || !data?.user  ){
        return(
          <Error401 />
        )
      }

   
    return(
        <div className={styles.editPatientContainer}>

            <Menu />

            <Header />

            <div className={styles.content}>

                <h2>Editar paciente <MdPeopleAlt color='black' /> </h2>

                <form>

                <NewImage
                 onChange={(e) => HandleChangeImgPatient(e)}
                 imgSRC={imagePreview}
                 />

                        
                <div className={styles.formData}>

                    <div>

                    <label
                    htmlFor="name">

                        Nome


                        <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.input}    
                        id="name"
                        type="text"
                        placeholder="Fulano da Silva"
                        icon={BsPeople}
                        />

              
                     </label>


                     <label
                    htmlFor="CPF">

                        CPF


                        <Input
                        value={cpf}
                        onChange={e => setCpf(e.target.value)}
                        mask='999.999.999-99'
                        className={styles.input}    
                        id="CPF"
                        type="text"
                        placeholder="112.119.669-53"
                        icon={BsPeople}
                        />

              
                     </label>


                    </div>

                <div>

                    <label
                    htmlFor="email">

                        Email


                        <Input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className={styles.input}    
                        id="email"
                        type="email"
                        placeholder="fulano@gmail.com"
                        icon={MdEmail}
                        />

              
                     </label>


                     <label
                    htmlFor="phone">

                        Telefone

                        <Input
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        mask="(99) 99999 - 9999"
                        className={styles.input}    
                        id="phone"
                        type="text"
                        placeholder="(00) 00000 - 0000"
                        icon={BiPhone}
                        />

              
                     </label>


                </div>


                    <div>

                    <label
                    htmlFor="calendar">

                        Data de nascimento


                        <Input
                        value={birth}
                        onChange={e => setBirth(e.target.value)}
                        mask='99/99/9999'
                        className={styles.input}    
                        id="birth"
                        type="text"
                        placeholder="01/12/2004"
                        icon={FaBirthdayCake}
                        />

              
                     </label>

                     <label
                    htmlFor="CEP">

                        CEP


                        <Input
                        value={zipCode}
                        onChange={e => setZipCode(e.target.value)}
                        mask='99999-999'
                        className={styles.input}    
                        id="CEP"
                        type="phone"
                        placeholder="89160-000"
                        icon={BsFillPostcardFill}
                        />

              
                     </label>


                    </div>
                    
                    
                <div>

                    <label
                    htmlFor="address">

                        Endereço


                        <Input
                        value={adress}
                        onChange={e => setAdress(e.target.value)}
                        className={styles.input}    
                        id="address"
                        type="text"
                        placeholder="Rua Carlos Gomes"
                        icon={FaRegAddressCard }
                        />


              
                     </label>

                </div>


                    <div>

                     <label
                    htmlFor="neighborhood">

                        Bairro


                        <Input
                        value={neighborhood}
                        onChange={e => setNeightborhood(e.target.value)}
                        className={styles.input}    
                        id="neighborhood"
                        type="text"
                        placeholder="Centro"
                        icon={FaRegAddressCard }
                        />

              
                     </label>


                     <label
                    htmlFor="number">

                        Número


                        <Input
                        value={residenceCode}
                        onChange={e => setResidenceCode(e.target.value)}
                        className={styles.input}    
                        id="number"
                        type="number"
                        placeholder="121"
                        icon={TbNumber }
                        />
               
                     </label>

                        
                        
                    </div>
                     

                     <div>


                        <label>

                        <p>Observação</p>
                        <textarea 
                        
                        value={observation}
                        onChange={e => setObservation(e.target.value)}
                        placeholder='Descreva aqui alguma observação importante ou detalhes da última consulta'>

                        </textarea>

                    
                        </label>

                        <Button
                        onClick={() => handleUpdatePatient()}
                        isLoading = { isLoading }
                        className={styles.save}
                        title='Salvar'
                            />

                     </div>

                     
                </div>
                    

                </form>

            </div>
        </div>
    )
}