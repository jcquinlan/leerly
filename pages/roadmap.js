import React from 'react';
import styled from 'styled-components';
import {
    Container,
    HeroWrapper,
    HeroContent,
    Divider,
    Title,
    NarrowContainer,
    Subtitle,
    Button,
    Card
} from '../components/styled';

const roadmapIdeas = [
    {
        title: 'Filter articles by difficulty',
        description: 'Only see articles that match your comfort level.',
        status: 'coming-soon'
    },
    {
        title: 'Filter articles by topic',
        description: 'Only see articles about stuff you enjoy, like science, culture, art, etc.',
        status: 'coming-soon'
    },
    {
        title: 'Support other languages',
        description: 'French? German? Mandarin? Italian? All of the above?',
        status: 'on-the-horizon'
    },
    {
        title: 'Track speaking session attendance in your level',
        description: 'It would be nice if you got experience in leerly for attending our weekly speaking sessions.',
        status: 'hypothetical'
    },
    {
        title: 'Add images to vocab cards',
        description: 'Would make it easier to study, and more helpful',
        status: 'hypothetical'
    },
    {
        title: 'Have popular Spanish teachers as guest writers',
        description: 'It would be interesting if we had guest stars right some articles for us. Maybe Spanish language teacher influencers or something.',
        status: 'hypothetical'
    },
    {
        title: 'Make vocab studying a proper spaced-repition experience',
        description: 'We could detext which words you struggle with, and show those to you more often.',
        status: 'coming-soon'
    }

];

const renderRoadmapIdea = (idea) => {
    const getStatusText = {
        'coming-soon': 'Coming soon',
        'hypothetical': 'Hypothetical',
        'in-progress': 'In Progress',
        'on-the-horizon': 'On the Horizon'
    }[idea.status];

    return (
        <Idea>
            <IdeaHeader>
                <IdeaTitle>
                    {idea.title}
                </IdeaTitle>
                -
                <IdeaStatus status={idea.status}>
                    {getStatusText} 
                </IdeaStatus>
            </IdeaHeader>

            <IdeaDescription>
                {idea.description}
            </IdeaDescription>
        </Idea> 
    )
}

function RoadmapPage () {
    return (
        <>
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>our roadmap</Title>
                <Subtitle>stuff we want to build, will build, or are building</Subtitle>
            </HeroContent>
        </HeroWrapper>

        <Divider />

        <NarrowContainer>
            <Text>
                We have big plans for leerly, but can only write so many lines of code at once, so here is our
                public (and non-exhaustive!) roadmap of features we want to add. Some are hypothetical ("Wouldn't it be cool if..."), and some
                are necessary ("We absolutely need to add..."). There are probably many we are actively working on, too.

                <br ></br>
                <br ></br>

                As always, let us know if you have any suggestions by emailing our support email.
            </Text>
        </NarrowContainer>

        <IdeaList>
            {roadmapIdeas.map(renderRoadmapIdea)}
        </IdeaList>

        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '60px 0'}}>
            <a href="/register"><Button>Join leerly for free</Button></a>
        </div>

        </Container>
        </>
    );
}

export default RoadmapPage;

const Text = styled.p`
    line-height: 30px;
    font-weight: 500;
`;

const IdeaList = styled.div`
    margin-top: 30px;
`;
const Idea = styled(Card)`
    margin-bottom: 10px;
`;
const IdeaHeader = styled.div`
    display: flex;
    align-items: center;
`;
const IdeaTitle = styled.h4`
    margin: 0;
    margin-right: 10px;
`;
const IdeaStatus = styled.span`
    margin-left: 10px;
    color: ${props => props.status === 'active' ? 'green' :
        props.status === 'hypothetical' ? 'orange' :
        props.status === 'on-the-horizon' ? 'purple' :
        props.status === 'coming-soon' ? 'blue' : ''};
`;
const IdeaDescription = styled.p`
    margin: 0;
`;
