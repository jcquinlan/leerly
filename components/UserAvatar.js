import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { getUserProfileImageURL } from '../services/userService'

const UserAvatar = ({ userProfile, size = 80 }) => {
  const [url, setUrl] = useState()

  useEffect(() => {
    const asyncFunc = async () => {
      try {
        if (userProfile?.profileImage) {
          const url = await getUserProfileImageURL(userProfile?.profileImage)
          setUrl(url)
        }
      } catch (e) {
        console.error(e)
      }
    }

    asyncFunc()
  }, [userProfile])

  if (!url) return null

  return (
        <Avatar size={size} src={url} />
  )
}

export default UserAvatar

const Avatar = styled.img`
    border-radius: 50%;
    border: 4px solid #eee;
    width: ${props => props.size}px;
`
