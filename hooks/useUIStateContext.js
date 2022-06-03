import { useState } from 'react'

const useUIStateContext = () => {
  const [modal, setModal] = useState(null)
  const [navOpen, setNavOpen] = useState(false)
  const [isSelectingText, setIsSelectingText] = useState(false)
  const [hoverVocabPopoverOpen, setHoverVocabPopoverOpen] = useState(false)

  return {
    modal,
    navOpen,
    isSelectingText,
    hoverVocabPopoverOpen,
    setModal,
    setNavOpen,
    setIsSelectingText,
    setHoverVocabPopoverOpen
  }
}

export default useUIStateContext
