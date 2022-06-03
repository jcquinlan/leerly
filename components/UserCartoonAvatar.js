import React from 'react'
import Avatar from 'boring-avatars'
import Colors from './styled/colors'

const UserCartoonAvatar = ({ userId, size = 80 }) => {
  return (
        <Avatar
            size={size}
            name={userId}
            variant="beam"
            colors={[
              Colors.Primary,
              Colors.CartoonAvatars.Flax,
              Colors.CartoonAvatars.GreenMunsell,
              Colors.CartoonAvatars.Marigold,
              Colors.CartoonAvatars.MaximumBluePurple
            ]}
        />
  )
}

export default UserCartoonAvatar
