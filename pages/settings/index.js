import React, {useState, useContext, useEffect, useMemo} from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useToasts } from 'react-toast-notifications';
import {
    Container,
    HeroWrapper,
    HeroContent,
    Divider,
    Title,
    Card,
    Button,
    NarrowContainer,
    Input
} from '../../components/styled';
import UserCartoonAvatar from '../../components/UserCartoonAvatar';
import LevelSelector from '../../components/LevelSelector';
import useAsync from '../../hooks/useAsync';
import { getBillingURL } from '../../services/stripeService';
import AppContext from '../../contexts/appContext';
import useGuardRoute from '../../hooks/useGuardRoute';
import { updateUserProfile } from '../../services/userService';

function SettingsPage () {
    useGuardRoute();

    const {addToast} = useToasts();
    const {user, userProfile, updateUserProfileLocally} = useContext(AppContext);
    const {data, loading, error} = useAsync(() => getBillingURL(userProfile.customerId), (data) => data);
    const billingUrl = data ? data.url : '';
    const [userName, setUserName] = useState('');
    const [userLevel, setUserLevel] = useState();
    const [saving, setSaving] = useState(false);

    // We only want to allow them to save changes when something has actually changed
    // in their profile, so we need to save a copy when the page loads, and only enable
    // the save button when the current user info fails to match this original copy of the
    // user profile information.
    const originalUserProfile = useMemo(() => {
        if (userProfile) {
            return userProfile;
        }
    }, [userProfile]);

    useEffect(() => {
        if (userProfile) {
            setUserName(userProfile?.name);
            setUserLevel(userProfile?.levels?.spanish);
        }
    }, [userProfile]);

    const profileHasChanged = useMemo(() => {
        const userNameHasChanged = userName !== originalUserProfile?.name;
        const userLevelHasChanged = userLevel !== originalUserProfile?.levels?.spanish;

        return userNameHasChanged || userLevelHasChanged;
    }, [userName, userLevel, originalUserProfile]);

    const handleNameChange = (e) => {
       setUserName(e.target.value);
    }

    const handleNewUserLevel = (newLevel) => {
        setUserLevel(newLevel);
    }

    const saveProfile = () => {
        const profileAttrs = {
            name: userName,
            levels: {
                ...(userProfile.levels ? userProfile.levels : {}),
                spanish: userLevel
            }
        }

        setSaving(true);

        updateUserProfile(user.uid, profileAttrs)
            .then(() => {
                addToast('Profile updated', {appearance: 'success'})
                updateUserProfileLocally(profileAttrs);
            })
            .catch(() => {
                addToast('Error updating profile', {appearance: 'error'})
            })
            .finally(() => {
                setSaving(false);
            })
    }

    return (
        <Container>
            <HeroWrapper>
                <HeroContent>
                    <Title>account</Title>
                </HeroContent>
            </HeroWrapper>

            <Divider />

            <NarrowContainer>
                <Card style={{marginBottom: '60px'}}>
                    <Flex>
                        <AvatarSection>
                            <UserCartoonAvatar userId={user?.uid} />
                        </AvatarSection>

                        <div style={{flex: 1}}>
                            <FormControl>
                                <label htmlFor="name">Name</label>
                                <Input type="text" placeholder="The name you go by" value={userName} onChange={handleNameChange} />
                            </FormControl>

                            <div>
                                <h5>Select your Spanish level</h5>
                                <LevelSelector level={userLevel} onSelectLevel={handleNewUserLevel} />
                            </div>

                            <Button style={{marginTop: '20px'}} disabled={!profileHasChanged || saving} onClick={saveProfile}>Save changes</Button>
                        </div>
                    </Flex>
                </Card>
            </NarrowContainer>

            <Section>
                <SectionTitle>Billing / Plans</SectionTitle>
                <SectionSubtitle>Note: Ending your subscription will delete your account completely.</SectionSubtitle>
                <ul>
                    <li><Link href={billingUrl}>Manage billing / change plan</Link></li>
                </ul>
            </Section>

            <Section>
                <SectionTitle>Support</SectionTitle>
                <span>For support, please email <a href="mailto:leerlylearning@gmail.com">leerlylearning@gmail.com</a></span>
            </Section>
        </Container>
    );
}

export default SettingsPage;

const Section = styled.div`
    margin-bottom: 30px;
`;
const SectionTitle = styled.h4`
    margin-bottom: 5px;
`;
const SectionSubtitle = styled.p`
    font-size: 14px;
    color: #666;
    margin-top: 0;
`
const FormControl = styled.div`
    margin-bottom: 10px;

    input {
        margin-top: 10px;
    }

    &:last-child {
        margin-bottom: 0;
    }
`;

const AvatarSection = styled.div`
    margin-right: 30px;
    h5 {
        margin: 0;
        font-size: 16px;
    }
`;

const Flex = styled.div`
    display: flex;
`;