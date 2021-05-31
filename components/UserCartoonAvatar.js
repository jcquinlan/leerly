import React, { useContext } from 'react';
import Avatar from "boring-avatars";
import Colors from './styled/colors';
import appContext from '../contexts/appContext';

const UserCartoonAvatar = ({size = 80}) => {
    const {userProfile} = useContext(appContext);

    return (
        <Avatar
            size={size}
            name={userProfile?.email || 'default'}
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

export default UserCartoonAvatar;