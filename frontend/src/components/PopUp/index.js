import { useState } from "react";

export function LoginPop(initialState=false) {
    const [openLogin, setOpenLogin] = useState(initialState);
    const onOpenLogin = () => setOpenLogin(true);
    const offOpenLogin = () => {
        location.reload();
        setOpenLogin(false);
    }
    
    return {openLogin, onOpenLogin, offOpenLogin};
}