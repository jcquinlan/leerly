import { useContext, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import dynamic from 'next/dynamic'
import placeRightBelow from 'react-text-selection-popover/lib/placeRightBelow'
import { PopoverBody } from './styled'
import useTranslationPopoverLogic from '../hooks/useTranslationPopoverLogic'
import UIStateContext from '../contexts/uiStateContext'

const Popover = dynamic(
  () => import('react-text-selection-popover'),
  {
    ssr: false
  }
)

const getTextSelection = () => {
  if (window) {
    const selectionInstance = window.getSelection()
    return selectionInstance.toString()
  }
}

const SelectedTextPopover = ({ elementRef, articleBody }) => {
  const { setIsSelectingText } = useContext(UIStateContext)
  const getArticleBody = () => articleBody
  const {
    popoverBody,
    popoverText,
    resetPopoverState,
    translateText
  } = useTranslationPopoverLogic(getArticleBody)
  const [tooManyWords, setTooManyWords] = useState(false)

  const debouncedHandleTextSelect = useDebouncedCallback(async () => {
    const newSelectedText = getTextSelection()
    const tooManyWords = newSelectedText.split(' ').length > 5

    if (tooManyWords) {
      setTooManyWords(true)
      return
    }

    translateText(newSelectedText)
  }, 1000)

  const handleTextSelect = (args) => {
    setIsSelectingText(true)
    debouncedHandleTextSelect.callback(args)
  }

  const resetFullPopoverState = () => {
    resetPopoverState()
    setTooManyWords(false)
    setIsSelectingText(false)
  }

  return (
        <Popover
            placementStrategy={placeRightBelow}
            selectionRef={elementRef}
            onTextSelect={handleTextSelect}
            onTextUnselect={resetFullPopoverState}>
            <PopoverBody>
                {tooManyWords ? <span>Select no more than <br /> 5 words at a time.</span> : popoverText}
                {popoverBody}
            </PopoverBody>
        </Popover>
  )
}

export default SelectedTextPopover
