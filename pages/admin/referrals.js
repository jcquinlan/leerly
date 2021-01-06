import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {
    Container,
    HeroWrapper,
    HeroContent,
    Divider,
    Title,
    Subtitle,
    Button
} from '../../components/styled';
import {getReferralRecords, markRecordAsRedeemed} from '../../services/referralService';

function ArticlePage () {
    const [referrals, setReferrals] = useState([]);
    const [isUpdatingRecord, setIsUpdatingRecord] = useState(false);

    useEffect(() => {
        getReferralRecords()
            .then(records => {
                if (!records.empty) {
                    const formattedReferralRecords = records.docs.map(doc => {
                        return {
                            id: doc.id,
                            ...doc.data()
                        }
                    });

                    setReferrals(formattedReferralRecords);
                }
            })
    }, []);

    const redeemRecord = async (id) => {
        if (!isUpdatingRecord) {
            setIsUpdatingRecord(true);
            await markRecordAsRedeemed(id)
            setReferrals(referrals => referrals.filter(record => record.id !== id));
            setIsUpdatingRecord(false);
        }
    }

    return (
        <>
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>open referrals</Title>
                <Subtitle>These are referrals that need to be applied to a user's Stripe subscription</Subtitle>
            </HeroContent>
        </HeroWrapper>

        <Divider />
        
        <ListWrapper>
        {referrals.map(referral => (
            <ReferralItem onClick={() => redeemRecord(referral.id)}>
                <span>{referral.email}</span>
                <Button>Mark as Redeemed</Button>
            </ReferralItem>
        ))}
        </ListWrapper>

        </Container>
        </>
    );
}

export default ArticlePage;

const ListWrapper = styled.div``;
const ReferralItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 8px;
    margin-bottom: 15px;
`;
