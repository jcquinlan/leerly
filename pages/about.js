import React from 'react';
import styled from 'styled-components';
import {Container, HeroWrapper, HeroContent, Divider, Title, NarrowContainer, Subtitle, Button} from '../components/styled';

function AboutPage () {
    return (
        <>
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>about leerly</Title>
                <Subtitle>Why we do what we do (and why it works)</Subtitle>
            </HeroContent>
        </HeroWrapper>

        <Divider />

        <NarrowContainer>
            <AboutUsText>
                We think that the "best" way to learn a language is through consuming Comprehensible Input, which means reading and listening
                to your target language at a level that's tough, but not too tough. It sounds kind of ridiculous, but you can learn a language
                to fluency just through reading and listening, and with minimal translation, too. Well, it sounds ridiculous until you realize
                that this is exactly how we learn our first language as lil' babies.
                <br></br>
                <br></br>
                We didn't really believe it until we noticed our Spanish improving quickly.
                Once we discovered how well it works we knew we needed to help others learn this way. Then we realized there were
                already a bunch of very smart people <sup>[1][2][3]</sup> who knew this, and there was a name for this method:
                <a href="https://en.wikipedia.org/wiki/J._Marvin_Brown#Automatic_Language_Growth" target="_blank"> Automatic Language Growth</a>.
                <br></br>
                <br></br>
                The only problem is that it can be hard to find material in your target language which is interesting, but not too advanced.
                Personally, I got sick of watching Peppa Pig in Spanish as a 27 year old, and I wasn't ready to read full novels in Spanish yet.
                I figured there must be a better way.
                <br></br>
                <br></br>
                So some friends and I made leerly. We provide text that's simple, but not
                childish, and slow audio to train the ear. We also provide some tools to make it easier to unblock yourself, like allowing
                translation in the articles, and vocab studying, even if these aren't strictly encouraged by Automatic Language Growth.
                Give it a try, and let us know what you think. We're confident you'll see progress, and we can't wait to chat with you in Spanish.
                <br></br>
                <br></br>
                - The leerly team 💖
            </AboutUsText>

            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '60px 0'}}>
                <a href="/register"><Button>Start now with a free month</Button></a>
            </div>
            
            <Sources>
                <li><a href="https://en.wikipedia.org/wiki/J._Marvin_Brown" target="_blank">J. Marvin Brown</a></li>
                <li><a href="https://en.wikipedia.org/wiki/Stephen_Krashen" target="_blank">Stephen Krashen</a></li>
                <li><a href="https://en.wikipedia.org/wiki/Tracy_D._Terrell" target="_blank">Tracy D. Terrell</a></li>
            </Sources>

        </NarrowContainer>

        </Container>
        </>
    );
}

export default AboutPage;

const AboutUsText = styled.p`
    line-height: 30px;
    font-weight: 500;
`;

const Sources = styled.ol`
    margin-top: 60px;

    li {
        margin-bottom: 15px;
    }
`;
