import React from 'react';
import styled from 'styled-components';
import {Container, HeroWrapper, HeroContent, Divider, Title, Subtitle, Button} from '../components/styled';
import BetaSignupForm from '../components/BetaSignupForm';

function App() {
  return (
    <>
    <Container>
      <HeroWrapper>
        <HeroContent>
            <Title>leerly.</Title>
            <Subtitle>
              Popular articles from around the web, summarized and translated by native speakers to 
              intermediate Spanish, delivered to you throughout the week.
              <br></br>
              <Faint>Qué guay</Faint>.
            </Subtitle>
          </HeroContent>
      </HeroWrapper>

      <Divider />

      <Subtitle>Here's how it works:</Subtitle>
      <Step>
        <StepNumber>1.)</StepNumber>
        <div>
          <StepTitle>We search for popular, current, widely-shared articles from around the web.</StepTitle>
          <DescriptionText>
            We try to use articles that are being shared a lot, and cover a wide range of topics, like tech,
            business, art, news, science, culture, etc. We source news outlets, reddit, Hacker News, and more
            to find what's being read around the web each day.
          </DescriptionText>   
        </div>
      </Step>

      <Step>
        <StepNumber>2.)</StepNumber>
        <div>
          <StepTitle>We summarize and translate them to B1/B2 Spanish.</StepTitle>
          <DescriptionText>
            The crucial step. We aim to have everything accessible to intermediate learners. And no machine translations here,
            just natural language from a native speaker. This way we can make sure you learn how native speakers actually talk,
            and not how Google's fancy machine-learning models talk.
          </DescriptionText>   
        </div>
      </Step>

      <Step>
        <StepNumber>3.)</StepNumber>
        <div>
          <StepTitle>We send them to you throughout the week. That's it.</StepTitle>
          <DescriptionText>
            You get to practice reading Spanish that's not <i>too</i> challenging while reading stuff you probably
            already would have read in English, and without needing to find kid's books or young adult novels in Spanish.
          </DescriptionText>   
        </div>
      </Step>

      <HeroWrapper>
          <HeroContent>
            {/* <SignUpButton>Start Reading Now</SignUpButton> */}
            <BetaSignupForm />
          </HeroContent>
        </HeroWrapper>

      {/* <Subtitle>Pricing</Subtitle>
      <DescriptionText>It's just <Free>$10/month</Free>.</DescriptionText> */}
      {/* <PricingWrapper>
        <PricingBlock>
          <PriceTitle>Free</PriceTitle>
          <PriceDescription>
            Receive an article a day, in basic Spanish.
          </PriceDescription>
        </PricingBlock>
      </PricingWrapper> */}


      <Divider />

      <Question>
      <Subtitle>But why do I want this?</Subtitle>
        <DescriptionText>
          For intermediate Spanish learners, it can be hard to find reading material which is understandable, but still interesting. We would know, we're trying
          to learn Spanish ourselves. In order to make language acquisition easier, we wanted to ensure we could practice Spanish while going about our normal lives.
          That means reading stuff we already wanted to read, but in Spanish which is perfectly suited to our level. Practicing Spanish is easier when
          you can do it while reading cool articles you like, or trashy celebrity drama (we probably won't translate trashy celebrity drama, don't worry).
        </DescriptionText>
      </Question>

      <Question>
        <Subtitle>How much does it cost?</Subtitle>
        <DescriptionText>
          When we launch, access to leerly will cost <Free>$15/month</Free>. For this price, you'll receive summarized and translated versions of
          viral articles throughout the week. You'll also get access to neat features we're currently working on ;)
        </DescriptionText>
      </Question>

      <Question>
        <Subtitle>Can't I just use Google Translate or something?</Subtitle>
        <DescriptionText>
          Sure! But we've found that it's best to have a native Spanish speaker rewrite the articles, to ensure that the Spanish
          is targeted specifically for intermediate learners. If you're an advanced speaker, you might not need this.
        </DescriptionText>
      </Question>
    </Container>
    </>
  );
}

export default App;

const Faint = styled.span`
  color: #666;
  font-family: 'Poppins', sans-serif;
`;

const Step = styled.div`
  display: flex;
  margin-top: 30px;
`;

const StepNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 20px;
  font-size: 48px;
`;

const StepTitle = styled.h5`
  font-size: 18px;
  margin: 0;
`;

const DescriptionText = styled.p`
  color: #666;
  margin: 0;
  line-height: 28px;
`;

const Question = styled.div`
  margin-top: 60px;

  &:first-child {
    margin-top: 0;
  }
`;

const Free = styled.b`
  color: #000;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
`;

const PricingWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 60px;
`;

const PricingBlock = styled.div`
  width: 100%;
  max-width: 250px;
  margin-right: 30px;
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 15px;

  &:last-child {
    margin-right: 0;
  }
`;

const PriceTitle = styled.h5`
  text-align: center;
  margin: 0;
  font-size: 24px;
`;

const PriceDescription = styled.p`
  margin: 0;
  color: #666;
`;

const SignUpButton = styled(Button)`
  margin-top: 60px;
`;