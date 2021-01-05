import React, {useState, useEffect, useContext} from 'react';
import styled from 'styled-components';
import {
    Container,
    HeroWrapper,
    HeroContent,
    Title,
    Divider,
    Subtitle,
    Button
} from '../components/styled';
import useGuardRoute from '../hooks/useGuardRoute';
import {createNewReferralCode, getUserReferralCode} from '../services/referralService';
import AppContext from '../contexts/appContext';

function ArticlePage () {
    useGuardRoute();
    const {user, userProfile, loading} = useContext(AppContext);
    const [referralCode, setReferralCode] = useState();
    const [loadingReferralCode, setLoadingReferralCode] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (user) {
            getUserReferralCode(user.uid)
                .then(referralCodeRef => {
                    if (referralCodeRef.exists) {
                        setReferralCode(referralCodeRef.data().referralCode);
                        setLoadingReferralCode(false);
                    }
                })
        }
    }, [user]);

    useEffect(() => {
        // If the request to get the user's referral code is complete,
        // and there is no code, we know we need to make one.
        if (!loadingReferralCode && !loading && !referralCode) {
            createNewReferralCode({userId: user.uid, email: user.email, customerId: userProfile.customerId})
                .then((referralCode) => {
                    setReferralCode(referralCode);
                    setLoadingReferralCode(false);
                });
        }
    }, [loadingReferralCode, loading, referralCode]);

    const referralURL = `https://leerly.io/register?referralCode=${referralCode}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralURL);
        setCopied(true);
    }

    return (
        <>
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>refer your friends</Title>
                <Subtitle>For each person that signs up using the link you send them, you get a free month of leerly.</Subtitle>
            </HeroContent>
        </HeroWrapper>

        <Divider />

        <div>
            {(loading || loadingReferralCode) && (
                <div>loading</div>
            )}

            {!!referralCode && !(loading || loadingReferralCode) && (
                <>
                    <div>
                        To refer someone, have them sign up to leerly using the link below.
                    </div>
                    <ReferralURL>{referralURL}</ReferralURL>
                </>
            )}

            <Button onClick={copyToClipboard}>{copied ? 'Copied!' : 'Copy to Clipboard'}</Button>
        </div>

        </Container>
        </>
    );
}

export default ArticlePage;

const ReferralURL = styled.p`
    margin-top: 30px;
    font-size: 24px;
`
