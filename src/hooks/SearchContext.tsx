import React, {createContext, useEffect, useContext, ReactNode, useState, ChangeEvent} from 'react'
import { ProviderProps } from '@/interfaces/providers'



interface SearchProvider {
    search : string;
    changeSearch : (credentials : ChangeEvent<HTMLInputElement>) => void
}



export const SearchContext  = createContext({} as SearchProvider)


export function SearchProvider({children} : ProviderProps){

    const [search, setSearch] = useState<string>('') 

    function changeSearch(e: ChangeEvent<HTMLInputElement>){

        setSearch(e.target.value)

    }


    return(


        <SearchContext.Provider value={{
            changeSearch, 
            search
        }}>

            {children}

        </SearchContext.Provider>
    )

}


export const useSearch = () => {
    const context = useContext(SearchContext)

    return context
}






