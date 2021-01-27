import React, {useState, useRef} from 'react';
import styled from 'styled-components';
import ReactAudioPlayer from 'react-audio-player';
import { DefaultSeo } from 'next-seo';
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
  AudioWrapper,
  FakeAudioWidget
} from '../components/styled';
import {SimplifiedSelectedTextPopover} from '../components/SelectedTextPopover';
import Data from '../landingPageData';

function App() {
  const exampleRef = useRef();
  const [playAudio, setPlayAudio] = useState(false);
  const [exampleOpen, setExampleOpen] = useState(false);

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
            Improve your Spanish by listening to and reading popular articles from major
            news sites, all summarized and translated to intermediate Spanish by native speakers. 
            <br /><Faint> Qué guay.</Faint>
          </Subtitle>

          <div style={{display: 'flex', justifyContent: 'center'}}>
            <a href="/register"><SignUpButton>Start now with a free month</SignUpButton></a>
          </div>
        </MainHeroContent>
      </HeroWrapper>

      <SectionDivider />

      <SectionHeader>How the articles work</SectionHeader>
      <DescriptionText>
        Play the audio, and <Faint>highlight words to translate</Faint> to English.
      </DescriptionText>

      {!playAudio && (
        <AudioWrapper>
            <FakeAudioWidget onClick={() => setPlayAudio(true)}>
                <span>Play audio</span> &#9658;
            </FakeAudioWidget>
        </AudioWrapper>
      )}

        {playAudio && (
          <AudioWrapper>
              <div>
                  <ReactAudioPlayer
                      src={Data.audioURL}
                      controls
                  />
              </div>
          </AudioWrapper>
      )}

      <SimplifiedSelectedTextPopover elementRef={exampleRef} articleBody={Data.article} />
      <Example ref={exampleRef} open={exampleOpen}>
          {Data.article}
      </Example>

      <ReadMoreWrapper>
          <button onClick={() => setExampleOpen(!exampleOpen)}>{exampleOpen ? 'Hide article' : 'Read the rest of the article'}</button>
      </ReadMoreWrapper>

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
{/* 
        <Testimonial>
          <Portrait>
            <img src="http://www.fillmurray.com/200/200" />
          </Portrait>
          <TestimonialWrapper>
            <Name>
              Elisabeth Clumpkens
            </Name>

            <Location>
              Richmond, VA
            </Location>

            <Quote>
              leerly is perfect because I’m reading articles that are interesting and relevant, but also allow me to develop my Spanish vocabulary.
            </Quote>
          </TestimonialWrapper>
        </Testimonial> */}
      </TestimonialRow>



      <div style={{display: 'flex', justifyContent: 'center'}}>
        <a href="/free"><Button>Try out some free articles</Button></a>
      </div>

    <PageContainer paddingTop="0px">
      <SectionDivider />

      <SectionHeader>Pricing</SectionHeader>
      <DescriptionText>
        leerly is <Free>$5/month</Free>, but for a <Free>free month trial</Free>, use the promotion code <Faint>LISTO</Faint> at checkout.
      </DescriptionText>

      <SectionDivider />

      {/* <Question>
        <QuestionText>How much does it cost?</QuestionText>
        <DescriptionText>
          leerly costs <Free>$5/month</Free>. Sign up now to lock in this price forever, since prices will
          be increasing as new features are rolled out.
        </DescriptionText>
      </Question> */}

      <Question>
        <QuestionText>What do I get with my subscription?</QuestionText>
        <FeaturesList>
          <li>New articles throughout the week, in B1/B2 Spanish</li>
          <li>Access to all past articles</li>
          <li>Audio for each article, slowly read by a native speaker</li>
          <li>Highlight to translate any text instantly while you read</li>
          <li>Save vocab directly from articles for reviewing later</li>
        </FeaturesList>
      </Question>

      <Question>
        <QuestionText>Do you have a trial?</QuestionText>
        <DescriptionText>Sure! For a free month, just use the code LISTO at checkout. We won't bill you for 4 weeks, and you can cancel any time before then.</DescriptionText>
      </Question>

      <Question>
        <QuestionText>What about refunds?</QuestionText>
        <DescriptionText>
          We can refund you, no questions asked. Just contact us using 
          <a target='_blank' href='https://forms.gle/SwWbhoD9mwpQ2JLx9'> this form</a>.
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
          As if. We think there is a lot we can do to make reading in intermediate Spanish more engaging, so we have a
          long list of things we want to finish building: a private chat group with native Spanish speakers, audio of native speakers
          reciting each article, comments and discussion on each article, in-article translation, etc.
        </DescriptionText>
      </Question>
    </PageContainer>
    </>
  );
}

export default App;

const SectionDivider = styled(Divider)`
  margin: 90px 0;
`;
const TestimonialRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 15px;
  align-items: center;

  @media ${devices.laptop} {
    flex-direction: row;
    margin-bottom: 90px;
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
const QuestionText = styled(Subtitle)`
  color: black;
`;
const MainHeroContent = styled(HeroContent)`
  @media ${devices.laptop} {
    margin: 90px 0 30px 0;
  }
`;
const Faint = styled.span`
  color: ${Colors.Primary};
  font-family: 'Poppins', sans-serif;
`;

const Example = styled.div`
  margin: 10px 0 30px 0;
  white-space: pre-wrap;
  border-radius: 5px;
  padding: 30px;
  line-height: 30px;
  font-size: 16px;
  height: ${props => props.open ? '100%' : '500px'};
  overflow-y: hidden;

  @media ${devices.laptop} {
    height: ${props => props.open ? '100%' : '308px'};
  }
`;

const ReadMoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 60px;

  button {
    background-color: transparent;
    border: none;
    color: ${Colors.Primary};
    font-size: 18px;
    cursor: pointer;
  }
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