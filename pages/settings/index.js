import React, {useState, useContext} from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import {Container, HeroWrapper, HeroContent, Divider, Title, Button} from '../../components/styled';
import useAsync from '../../hooks/useAsync';
import { getBillingURL } from '../../services/stripeService';
import AppContext from '../../contexts/appContext';
import useGuardRoute from '../../hooks/useGuardRoute';

function SettingsPage () {
    useGuardRoute();

    const {userProfile} = useContext(AppContext);
    const {data, loading, error} = useAsync(() => getBillingURL(userProfile.customerId), (data) => data);

    const billingUrl = data ? data.url : '';

    return (
        <Container>
            <HeroWrapper>
                <HeroContent>
                    <Title>account</Title>
                </HeroContent>
            </HeroWrapper>

            <Divider />

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