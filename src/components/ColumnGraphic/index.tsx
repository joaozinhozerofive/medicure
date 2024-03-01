import styles from './style.module.scss'


export interface GraphicProps{
    appoiments? : number
    className? : string
    finished? : number
}


export default function ColumnGraphic({appoiments, className}: GraphicProps){

    return (

        <div className={`${styles.ColumnGraphicContainer} ${className}`}>

            <div>
            
                <div>
                    
                </div>

                <div>

                </div>
                
                <div>

                </div>

                <div>

                </div>

        </div>

        <div>

        <h1>Agendamentos</h1>
        <h2>{appoiments}</h2>
        <p>Neste dia</p>

        </div>


        </div>
    )
}