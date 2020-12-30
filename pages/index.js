import React, {useState, useRef} from 'react';
import styled from 'styled-components';
import ReactAudioPlayer from 'react-audio-player';
import {
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
    <Container>
      <HeroWrapper>
        <MainHeroContent>
          <Title>leerly.</Title>
          <Subtitle>
            {/* Improve your Spanish by listening to and reading popular articles from major
            new sites, all summarized and translated to B1/B2 Spanish by native speakers.  */}
            Improve your Spanish by listening to and reading popular articles from major
            new sites, all summarized and translated to B1/B2 Spanish by native speakers. 
            <br /><Faint> Qué guay.</Faint>
          </Subtitle>

          <div style={{display: 'flex', justifyContent: 'center'}}>
            <a href="/register"><SignUpButton>Start now for $5/month</SignUpButton></a>
          </div>
        </MainHeroContent>
      </HeroWrapper>

      <Divider />

      <SectionHeader>Try it right here, right now</SectionHeader>
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

    </Container>

      <TestimonialRow>
        <Testimonial>
          <Portrait>
            <img src="/images/testimonials/marith.jpeg" />
          </Portrait>
          <TestimonialWrapper>
            <Name>
              Marith M.
            </Name>

            <Location>
              Spanish hobbyist
            </Location>

            <Quote>
              With leerly, I'm reading articles that are actually interesting, but at a skill level that doesn't feel too challenging for me.
              Plus I feel like my vocabulary is expanding in ways that auto-translators wouldn't help with.
            </Quote>
          </TestimonialWrapper>
        </Testimonial>

        <Testimonial>
          <Portrait>
            <img src="/images/testimonials/elisabeth.jpeg" />
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
            <img src="/images/testimonials/dougie.png" />
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

    <Container>
      <Divider />


      <Question>
        <SectionHeader>How much does it cost?</SectionHeader>
        <DescriptionText>
          leerly costs <Free>$5/month</Free>. Sign up now to lock in this price forever, since prices will
          be increasing as new features are rolled out.
        </DescriptionText>
      </Question>

      <Question>
      <SectionHeader>What do I get for $5/month?</SectionHeader>
      <FeaturesList>
        <li>New articles throughout the week, in B1/B2 Spanish</li>
        <li>Access to all past articles</li>
        <li>Audio for each article, slowly read by a native speaker</li>
        <li>Highlight to translate any text instantly while you read</li>
        <li>Save vocab directly from articles for reviewing later</li>
      </FeaturesList>
        {/* <DescriptionText>
          Throughout the week, we will add new articles to our website, and email out the links in a newsletter to all our customers.
          You'll also get access to all the past articles, for extra reading practice. Signing up now also ensures you'll have access to all future updates,
          like audio for each article, built-in translation, and the ability to ask native speakers specific questions about each article.
        </DescriptionText> */}
      </Question>

      {/* <Question>
      <SectionHeader>But why do I want this?</SectionHeader>
        <DescriptionText>
          For intermediate Spanish learners, it can be hard to find reading material which is understandable, but still interesting. We would know, we're trying
          to learn Spanish ourselves. In order to make language acquisition easier, we wanted to ensure we could practice Spanish while going about our normal lives.
          That means reading stuff we already wanted to read, but in Spanish which is perfectly suited to our level. Practicing Spanish is easier when
          you can do it while reading cool articles you like, or trashy celebrity drama (we probably won't translate trashy celebrity drama, don't worry).
        </DescriptionText>
      </Question> */}

      <Question>
        <SectionHeader>Do you have a trial?</SectionHeader>
        <DescriptionText>Sure! For a free month, just use the code LISTO at checkout. We won't bill you for 4 weeks, and you can cancel any time before then.</DescriptionText>
      </Question>

      <Question>
        <SectionHeader>What about refunds?</SectionHeader>
        <DescriptionText>
          We can refund you, no questions asked. Just contact us using 
          <a target='_blank' href='https://forms.gle/SwWbhoD9mwpQ2JLx9'> this form</a>.
        </DescriptionText>
      </Question>

      {/* <Question>
        <SectionHeader>Can't I just use Google Translate or something?</SectionHeader>
        <DescriptionText>
          Sure! But we've found that it's best to have a native Spanish speaker rewrite the articles, to ensure that the Spanish
          is targeted specifically for intermediate learners. If you're an advanced speaker, you might not need this. Plus,
          you wouldn't get all the other neat features we're building.
        </DescriptionText>
      </Question> */}

      <HeroWrapper>
        <HeroContent>
          <a href="/register"><SignUpButton>Start now for $5/month</SignUpButton></a>
        </HeroContent>
      </HeroWrapper>

      <Divider />

      <Question>
      <SectionHeader>That's it?</SectionHeader>
        <DescriptionText>
          As if. We think there is a lot we can do to make reading in intermediate Spanish more engaging, so we have a
          long list of things we want to finish building: a private chat group with native Spanish speakers, audio of native speakers
          reciting each article, comments and discussion on each article, in-article translation, etc.
        </DescriptionText>
      </Question>
    </Container>
    </>
  );
}

export default App;

const TestimonialRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 15px;
  margin-top: 30px;
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
  height: ${props => props.open ? '100%' : '308px'};
  overflow-y: hidden;
`;

const ReadMoreWrapper = styled.div`
  display: flex;
  justify-content: center;

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
  margin: 60px 0;
`;