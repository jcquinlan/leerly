import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { DefaultSeo } from 'next-seo';
import { useRouter } from 'next/router';
import {
  PageContainer,
  Container,
  HeroWrapper,
  HeroContent,
  Divider,
  Title,
  Subtitle,
  Button,
  devices,
  Colors,
  Card,
  Flex,
  NarrowContainer
} from '../components/styled';
import mixpanelContext from '../contexts/mixpanelContext';

function App() {
  const mixpanel = useContext(mixpanelContext);
  const router = useRouter();

  useEffect(() => {
    if (mixpanel) {
      mixpanel.trackEvent('landing-page-loaded');
    }
  }, []);

  const goToFreeArticle = async () => {
    await mixpanel.trackEvent('visited-free-article');
    router.push('https://leerly.io/articles/vpYjCXYQhULjO2PY6P6n');
  }

  return (
    <>
    <DefaultSeo
      title="leerly | learn spanish with comprehensible input"
      description={`Improve your Spanish by listening to and reading popular articles from major
news sites, all summarized and translated to intermediate Spanish by native speakers.`}
      openGraph={{
        type: 'website',
        locale: 'en_US',
        url: 'https://www.leerly.io/',
        site_name: 'leerly',
        images: [
          {
            url: 'https://firebasestorage.googleapis.com/v0/b/leerly.appspot.com/o/images%2Fleerly.png?alt=media',
            alt: `Improve your Spanish by listening to and reading popular articles from major
news sites, all summarized and translated to intermediate Spanish by native speakers.`,
          },
        ],
      }}
    />

    <Container>
      <HeroWrapper>
        <MainHeroContent>
          <Title>leerly.</Title>
          <Subtitle>
            Improve your Spanish with Compelling, Comprehensible Input.
            <Faint> Qué guay.</Faint>
          </Subtitle>

          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <a href="/register"><SignUpButton>Start now with a free month</SignUpButton></a>
          </div>
        </MainHeroContent>
      </HeroWrapper>

      <MainImage>
        <img src="/images/landing-page-screenshot.png"></img>
      </MainImage>

      <ImageSectionDivider />

      <div style={{marginBottom: '90px'}}>
        <NarrowContainer>
          <SectionExplanation>We give you popular articles every week in basic Spanish, because learning a language is as simple as…</SectionExplanation>
        </NarrowContainer>

        <ExperiencesList>
          <Feature>
            <h3>Listening</h3>
            <p>Native speakers slowly read everything, and you can follow along, or easily repeat sections.</p>
            <Card>
              <img src="/images/listening.gif" alt="Words highlighting in an article as the audio plays"/>
            </Card>
          </Feature>

          <Feature>
            <h3>Reading</h3>
            <p>Our writers use simple language, but write how they’d talk to their friends.</p>
            <Card>
              <img src="/images/vocab.gif" alt="Words highlighting in an article as the audio plays"/>
            </Card>
          </Feature>

          <Feature>
            <h3>Repetition</h3>
            <p>Save and review vocab from articles, so you can finally remember the difference between jugar and juzgar.</p>
            <Card>
              <img src="/images/study.gif" alt="Words highlighting in an article as the audio plays"/>
            </Card>
          </Feature>
        </ExperiencesList>

        {/* <NarrowContainer>
          <SectionExplanation>
            It turns out, your brain is good at picking up a new language as long as you have lots of reading and listening material in your
            target language. It's a learning philosophy called <a target="_blank" href="https://en.wikipedia.org/wiki/J._Marvin_Brown#Automatic_Language_Growth">Automatic Language Growth</a>, and it's working well for us, and our students.
          </SectionExplanation>
        </NarrowContainer> */}


        <FreeArticleWrapper>
          <h4>See for yourself by reading a free article</h4>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Button role="link" onClick={goToFreeArticle}>Read a free article now</Button>
          </div>
        </FreeArticleWrapper>

      </div>

      <GroupCallSection>
        <SectionHeader>Live video calls</SectionHeader>
        <DescriptionText>
          Join weekly video calls with a leerly Spanish teacher, either just to get some extra listening practice, or take a stab at
          joining the conversation in Spanish. Lurkers always welcome.
        </DescriptionText>

        <NarrowContainer>
          <img src="/images/leerly_group_call.png" />
        </NarrowContainer>
      </GroupCallSection>

      <SectionDivider />

      <SectionHeader>Testimonials</SectionHeader>
      <DescriptionText>
        Folks are using leerly as just one part of their language-learning journey, and seeing results.
      </DescriptionText>
    </Container>

      <TestimonialRow>
        <Testimonial>
          <Portrait>
            <img src="/images/testimonials/marith.jpeg" alt="An image of a leerly customer"/>
          </Portrait>
          <TestimonialWrapper>
            <Name>
              Marith M.
            </Name>

            <Location>
              Spanish hobbyist
            </Location>

            <Quote>
              With leerly, I'm reading articles that are actually interesting, but not too challenging.
              I feel like my vocabulary is expanding in ways that auto-translators wouldn't help with.
            </Quote>
          </TestimonialWrapper>
        </Testimonial>

        <Testimonial>
          <Portrait>
            <img src="/images/testimonials/elisabeth.jpeg" alt="An image of a leerly customer"/>
          </Portrait>
          <TestimonialWrapper>
            <Name>
              Elisabeth C.
            </Name>

            <Location>
              B2 Spanish Student
            </Location>

            <Quote>
              leerly is perfect because I’m reading articles that are interesting and relevant, but which also allow me to develop my vocabulary.
            </Quote>
          </TestimonialWrapper>
        </Testimonial>

        <Testimonial>
          <Portrait>
            <img src="/images/testimonials/dougie.png" alt="An image of a leerly customer"/>
          </Portrait>
          <TestimonialWrapper>
            <Name>
              Douglas R.
            </Name>

            <Location>
              Advanced speaker
            </Location>

            <Quote>
              leerly has been incredible in helping me brush up on my Spanish in a formal manner. Articles are engaging, informative and translated wonderfully.
              </Quote>
          </TestimonialWrapper>
        </Testimonial>
      </TestimonialRow>


    <PageContainer paddingTop="0px">
      <SectionDivider />

      <SectionHeader>Pricing</SectionHeader>
      <DescriptionText>
        leerly is free for the first month, then <Free>$5/month</Free>.
      </DescriptionText>

      <SectionDivider />

      <Question>
        <QuestionText>What do I get with my subscription?</QuestionText>
        <FeaturesList>
          <li>New articles throughout the week, in B1/B2 Spanish</li>
          <li>Access to all past articles</li>
          <li>Audio for each article, slowly read by a native speaker</li>
          <li>Highlight to translate any text instantly while you read</li>
          <li>Save vocab directly from articles for reviewing later</li>
          <li>Access to weekly video chat conversations with a native speaker and other leerly users</li>
        </FeaturesList>
      </Question>

      <Question>
        <QuestionText>Do you have a trial?</QuestionText>
        <DescriptionText>Sure! By default, the first month is totally free.</DescriptionText>
      </Question>

      <Question>
        <QuestionText>What about other languages?</QuestionText>
        <DescriptionText>
          Once we feel as though we have really nailed the learning experience with Spanish, we want to expand to other
          languages, like French and Chinese. For now, though, only Spanish is available.
        </DescriptionText>
      </Question>

      <Question>
        <QuestionText>What are the articles about?</QuestionText>
        <DescriptionText>
          We find popular articles around the web each week, and then summarize and translate them to intermediate Spanish.
          We try to make sure our articles run the gamut of genres, like art, science, culture, business, etc.
        </DescriptionText>
      </Question>

      <Question>
        <QuestionText>What about refunds?</QuestionText>
        <DescriptionText>
          We can refund you, no questions asked. Just contact us using 
          <a target='_blank' href='https://forms.gle/SwWbhoD9mwpQ2JLx9'> this form</a>.
        </DescriptionText>
      </Question>

      <Question>
        <QuestionText>How can I learn a language just by reading and listening?</QuestionText>
        <DescriptionText>
          Yeah, it sounds kind of whacky, I didn't believe it either. That's why we recommend you try it out with
          our free trial, or you can <a href='/about'>read about it a little bit first</a>.
        </DescriptionText>
      </Question>

      <HeroWrapper>
        <HeroContent>
          <a href="/register"><SignUpButton>Start now with a free month</SignUpButton></a>
        </HeroContent>
      </HeroWrapper>

      <SectionDivider />

      <Question>
        <QuestionText>That's it?</QuestionText>
        <DescriptionText>
          As <i>if</i>. We think there is a lot we can do to make reading in intermediate Spanish more engaging, so we have a
          long list of things we want to finish building: discussions on each article in beginner Spanish, group lessons with native speakers,
          visual cues in each article to accompany the audio, etc.
        </DescriptionText>
      </Question>
    </PageContainer>
    </>
  );
}

export default App;

const MainImage = styled.div`
  img {
    width: 100%;
  }
`;
const FreeArticleWrapper = styled.div`
  text-align: center;
  margin: 120px 0 120px 0;

  h4 {
    font-size: 20px;
  }
`;
const GroupCallSection = styled.div`
  img {
    width: 100%;
    margin-top: 60px;
  }
`;
const ExperiencesList = styled(Flex)`
  align-items: center;
  justify-contenter: center;
  flex-direction: column;
  padding-top: 60px;
  margin-bottom: 80px;
`;
const Feature = styled.div`
  max-width: 400px;
  margin-bottom: 80px;

  &:last-child {
    margin-bottom: 0;
  }

  h3 {
    font-size: 30px;
    margin-bottom: 0px;
    color: ${Colors.Primary};
  }

  p {
    margin-top: 0;
    line-height: 26px;
  }

  img {
    width: 100%;
  }
`;

const SectionDivider = styled(Divider)`
  margin: 90px 0;
`;
const ImageSectionDivider = styled(SectionDivider)`
  margin-top: -2px;
`;
const TestimonialRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 15px;
  align-items: center;

  @media ${devices.laptop} {
    flex-direction: row;
    align-items: flex-start;
  }
`;
const Testimonial = styled.div`
  margin-bottom: 30px;
  padding: 15px;
  display: flex;
  border: 1px solid #eee;
  border-radius: 8px;
  max-width: 400px;
  margin-bottom: 30px;

  &:last-child {
    margin-right: 0;
  }

  @media ${devices.laptop} {
    margin-bottom: 0;
    margin-right: 30px;

`;
const Portrait = styled.div`
  width: 50px;
  height: 50px;
  margin-right: 15px;

  img {
    width: 50px;
    border-radius: 25px;
  }
`;
const TestimonialWrapper = styled.div``;
const Name = styled.p`
  margin: 0;
  font-weight: bold;
`;
const Location = styled.p`
  margin: 0;
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
`;
const Quote = styled.p`
  margin: 0;
  line-height: 26px;
`;

const FeaturesList = styled.ul`
  font-size: 18px;
  color: #666;

  li {
    margin-bottom: 15px;
  }
`;
const SectionHeader = styled(Subtitle)`
  color: black;
  font-size: 30px;
`;
const SectionExplanation = styled(Subtitle)`
  font-size: 20px;
  line-height: 36px;
  font-weight: normal;

  a {
    text-decoration: underline;
    font-weight: bold;
    font-family: Poppins, sans-serif;
  }
`;
const QuestionText = styled(Subtitle)`
  color: black;
`;
const MainHeroContent = styled(HeroContent)`
  max-width: 400px;
  @media ${devices.laptop} {
    margin: 90px 0 30px 0;
  }
`;
const Faint = styled.span`
  color: ${Colors.Primary};
  font-family: 'Poppins', sans-serif;
`;

const DescriptionText = styled.p`
  color: #666;
  margin: 0;
  line-height: 32px;
  font-size: 18px;
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

const SignUpButton = styled(Button)`
  margin-top: 60px;
`;