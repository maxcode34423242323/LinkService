import {useState, useCallback, useEffect} from 'react'

const storagename = 'userData'

export const useAuth = () => {
    const [ token, setToken] = useState(null);
    const [ ready, setReady] = useState(false);
    const [ userId, setUserId] = useState(null);

    const login = useCallback((jwtToken, id)=> {
        setToken(jwtToken)
        setUserId(id)
        localStorage.setItem(storagename, JSON.stringify({userId: id, token: jwtToken}) )
    },[])

    const logOut = useCallback(()=> {
        setToken(null)
        setUserId(null)
        localStorage.removeItem(storagename)
    },[])
    
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storagename))
        if ( data && data.token){
            login(data.token, data.userId)
        }
        setReady(true)
    },[login])




    return { login, logOut, token, userId, ready }
}