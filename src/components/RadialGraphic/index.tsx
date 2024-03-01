import { GraphicProps } from '../ColumnGraphic';
import styles from './style.module.scss'
import Chart from 'react-apexcharts'




export default function RadialGraphic({appoiments, finished,className} : GraphicProps ){

    const options = {
        chart: {
          id: "radialBar",
        },
        labels: [`${finished }/${appoiments }`],
        
        
      };

      const percent = (finished  / appoiments ) * 100

      const series = [
        percent
    ]

    return (

        <div className={`${styles.graphicPizzaContainer} ${className}`}>

        <h1> Consultas finalizadas </h1>

            <Chart
            className = {styles.chart}
            type='radialBar'
            series={series}
            options={options} />



        </div>



        
    )
}