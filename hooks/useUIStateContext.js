import {useState} from 'react';

const useUIStateContext = () => {
    const [modal, setModal] = useState(null);
    const [navOpen, setNavOpen] = useState(false);
    const [isSelectingText, setIsSelectingText] = useState(false);

    return {
        modal,
        navOpen,
        isSelectingText,
        setModal,
        setNavOpen,
        setIsSelectingText
    }
}

export default useUIStateContext;
