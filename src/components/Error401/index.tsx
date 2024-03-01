import { useRouter } from 'next/router'
import styles from './style.module.scss'
import Button from '../Button'






export default function Error401(){
    const routes = useRouter()


    return (
        <div className={`${styles.content}`}>
            <div>


            <h1>Error:  <span>401</span></h1>
            <p>Você não tem autorização para entrar nesta página</p>

            <Button
            onClick={() => routes.push("/")}
            title='Voltar para a página de login'
             />

                
            </div>

        </div>
    )
}