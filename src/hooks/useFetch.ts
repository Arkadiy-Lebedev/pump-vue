import { ref } from "vue"
import { API } from "../api/api"

export const useFetchAllPumps = async () => {
    const data = ref<any[]>([])
    const error = ref<any | null>(null)
    const pending =  ref(false)
    
    pending.value = true
    try {
        const response = await fetch(`${API}/api/pump-cdlf/read.php`)
        const json = await response.json()
        data.value.push(...json.data)  
    } catch (err) {
        error.value = err  
    } finally {
        pending.value = false
    }
    
       try {
        const response = await fetch(`${API}/api/pump-td/read.php`)
        const json = await response.json()
        data.value.push(...json.data)    
    } catch (err) {
        error.value = err  
    } finally {
        pending.value = false
    }

     try {
        const response = await fetch(`${API}/api/pump/read.php`)
        const json = await response.json()
       data.value.push(...json.data)    
    } catch (err) {
        error.value = err  
    } finally {
        pending.value = false
    }



    
    return { data, error, pending }
}