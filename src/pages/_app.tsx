import  "../styles/styles.globals.scss"
import type { AppProps } from "next/app";
import { DateProvider } from "@/hooks/DateContext";
import { DoctorProvider } from "@/hooks/DoctorContext";
import { Toaster } from "react-hot-toast";
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { AuthProvider } from "@/hooks/AuthContex";
import { SearchProvider } from "@/hooks/SearchContext";




export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>

      <SearchProvider>

            <DateProvider>

              <DoctorProvider>

                  <Component {...pageProps} />;
                  <Toaster/>


                </DoctorProvider>

            </DateProvider>
            
        </SearchProvider>


      </AuthProvider>

  

  )
}
