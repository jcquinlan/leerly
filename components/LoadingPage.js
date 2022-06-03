import React from 'react'
import styled from 'styled-components'
import LoadingSpinner from './LoadingSpinner'

const LoadingPage = () => {
  return (
        <FullPageWrapper>
            <LoadingSpinner />
        </FullPageWrapper>
  )
}

export default LoadingPage

const FullPageWrapper = styled.div`
    height: 65vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`
