import React, {useState, useRef, useContext} from 'react';
import styled from 'styled-components';
import ReactCrop from 'react-image-crop';
import { useToasts } from 'react-toast-notifications';
import {Button, GhostButton} from './styled';
import {getCroppedImg} from '../services/imageService';
import {uploadProfileImage, updateUserProfile, getUserProfileImageURL} from '../services/userService';
import appContext from '../contexts/appContext';
import UserAvatar from './UserAvatar';

import 'react-image-crop/dist/ReactCrop.css';

const initialCrop = {
    unit: 'px',
    width: 50,
    aspect: 1
}

const UserAvatarControl = ({size = 80}) => {
    const {user, userProfile} = useContext(appContext);
    const [editMode, setEditMode] = useState(false);
    const [crop, setCrop] = useState(initialCrop);
    const [imageSource, setImageSource] = useState();
    const imageRef = useRef();
    const {addToast} = useToasts();

    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setEditMode(true);
                setImageSource(reader.result)
            });
            reader.readAsDataURL(e.target.files[0]);
          }
    }

    const onImageLoaded = (image) => {
        if (image.naturalWidth > 640 || image.naturalHeight > 640) {
            addToast('Image can be no larger than 640 x 640 pixels. Use a smaller image.', {appearance: 'error'});
            setImageSource(null);
            setEditMode(false);
            return;
        }

        imageRef.current = image;
    }

    const onCropComplete = () => {}
    const onCropChange = (crop) => {
        setCrop(crop);
    }

    const saveImage = async () => {
        if (user && crop?.width && crop?.height && imageRef.current) {
            const imageBlob = await getCroppedImg(
                imageRef.current,
                crop,
                `${user.uid}_profile_image.png`
            );

            const metaData = {
                uid: user.uid
            }

            try {
                await uploadProfileImage(imageBlob, metaData);
                await updateUserProfile(user.uid, {profileImage: `${user.uid}/${user.uid}_profile_image.png`});
                addToast('Profile image updated', {appearance: 'success'});
                setEditMode(false);
            } catch {
                addToast('Problem updating your profile image, please try again later.', {appearance: 'error'});
            }
        }
    }

    const startUpdateProfileImageWorkflow = () => {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = onSelectFile;
        input.click();
    }

    const renderInnards = () => {
        if (!editMode) {
            if (userProfile?.profileImage) {
                return (
                    <>
                        <UserAvatar userProfile={userProfile} />
                        <GhostButton onClick={startUpdateProfileImageWorkflow}>Update image</GhostButton>
                    </>
                )
            }

            return (
                <DefaultProfileImage size={size} onClick={startUpdateProfileImageWorkflow}>
                    +
                </DefaultProfileImage>
            )
        }

        return (
            <>
                {imageSource && (
                    <ReactCrop
                        src={imageSource}
                        crop={crop}
                        circularCrop
                        onImageLoaded={onImageLoaded}
                        onComplete={onCropComplete}
                        onChange={onCropChange}
                    />
                )}

                {!imageSource && (
                    <div>
                        <input type="file" accept="image/*" onChange={onSelectFile} />
                    </div>
                )}

                {imageRef.current && (
                    <div>
                        <Button onClick={saveImage}>Save Image</Button>
                    </div>
                )}
            </>
        )
    }

    return (
        <AvatarWrapper>
            {renderInnards()}
        </AvatarWrapper>
    )
}

const AvatarWrapper = styled.div`
    margin-bottom: 30px;
`;

const DefaultProfileImage = styled.div`
    background-color: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    font-size: 45px;
    cursor: pointer;
`;

export default UserAvatarControl;