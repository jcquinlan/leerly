import React from 'react';
// import Image from 'next/image';
import styled from 'styled-components';
import {Container, HeroWrapper, HeroContent, Divider, Title, Subtitle, Button, devices, Colors} from '../components/styled';
import {MaskedText} from '../components/ArticlePreview';

function App() {
  return (
    <>
    <Container>
      <HeroWrapper>
        <MainHeroContent>
          <Title>leerly.</Title>
          <Subtitle>
            Improve your Spanish by reading popular articles, all summarized and translated to B1/B2 Spanish by native speakers. 
            <Faint> Qué guay.</Faint>
          </Subtitle>

          <div style={{display: 'flex', justifyContent: 'center'}}>
            <a href="/register"><SignUpButton>Start now for $5/month</SignUpButton></a>
          </div>
        </MainHeroContent>
      </HeroWrapper>

      {/* <Divider /> */}

      {/* <SectionHeader>How it works</SectionHeader>
      <DescriptionText>We summarize and translate articles from your favorite sites, like the ones below.</DescriptionText>
      <Step>
        <StepNumber>1.)</StepNumber>
        <div>
          <StepTitle>We search for popular, relevant, widely-shared articles from around the web.</StepTitle>
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
      </Step> */}

      <Divider />

      <div>
        <SectionHeader>Want an example?</SectionHeader>
        <DescriptionText>
          We take articles, like <a href="https://www.theguardian.com/australia-news/2020/oct/15/the-great-unravelling-i-never-thought-id-live-to-see-the-horror-of-planetary-collapse" target="_blank">this one</a> about the Australian wildfires from The Guardian, extract the core information and facts,
          and present them in intermediate Spanish:
        </DescriptionText>

        <Example>
          <MaskedText maxHeight="800px">
              {exampleArticle}
          </MaskedText>
        </Example>
      </div>

      <Divider />

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

      <Question>
      <SectionHeader>But why do I want this?</SectionHeader>
        <DescriptionText>
          For intermediate Spanish learners, it can be hard to find reading material which is understandable, but still interesting. We would know, we're trying
          to learn Spanish ourselves. In order to make language acquisition easier, we wanted to ensure we could practice Spanish while going about our normal lives.
          That means reading stuff we already wanted to read, but in Spanish which is perfectly suited to our level. Practicing Spanish is easier when
          you can do it while reading cool articles you like, or trashy celebrity drama (we probably won't translate trashy celebrity drama, don't worry).
        </DescriptionText>
      </Question>

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

      <Question>
        <SectionHeader>How much does it cost?</SectionHeader>
        <DescriptionText>
          leerly costs <Free>$5/month</Free>. Sign up now to lock in this price forever, since prices will
          be increasing as new features are rolled out.
        </DescriptionText>
      </Question>

      <Question>
        <SectionHeader>Can't I just use Google Translate or something?</SectionHeader>
        <DescriptionText>
          Sure! But we've found that it's best to have a native Spanish speaker rewrite the articles, to ensure that the Spanish
          is targeted specifically for intermediate learners. If you're an advanced speaker, you might not need this. Plus,
          you wouldn't get all the other neat features we're building.
        </DescriptionText>
      </Question>



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

const exampleArticle = `Estos días pienso mucho en las últimas semanas de la vida de mi padre. Recuerdo su lucha contra la enfermedad y sus ganas de vivir. También recuerdo el día en que supe que íbamos a perderlo. Fue como un punto de no retorno: un día vi la muerte en su cara, y me di cuenta de que ya no podíamos hacer nada más por él.

Soy científica, e investigo sobre el calentamiento global. Mi trabajo consiste en elaborar informes para el Grupo Intergubernamental de Expertos sobre el Cambio Climático (IPCC), un organismo de las Naciones Unidas (ONU). Gracias a mis conocimientos, comprendo muy bien el estado de nuestro planeta, y ahora mismo estoy aterrorizada. Reconozco los incendios del verano pasado en Australia: son un punto de no retorno, como el que vi aquel día en la cara de mi padre.

Durante el Verano Negro Australiano se quemó el 20% del matorral del país. Más de tres mil millones de animales murieron quemados o perdieron su hábitat para siempre. El Gran Arrecife de Coral enfermó gravemente. La tierra necesitará varias generaciones humanas para curarse de todo ese daño. Las consecuencias del calentamiento global ya no son amenazas lejanas e improbables. Están aquí. Forman parte de nuestra experiencia vivida.

Los científicos intentamos movilizar a la sociedad con hechos y datos, pero en estos momentos siento que nuestros esfuerzos son inútiles. Los gobernantes no nos escuchan; prefieren proteger a las industrias de combustibles fósiles y a las empresas contaminantes. La ciudadanía sí comprende el problema y quiere ayudar, pero las soluciones prácticas o individuales como el reciclaje o las energías renovables no son suficientes. Creo que los datos científicos tampoco bastan: es necesaria una revolución emocional.
Más que comprenderla, necesitamos sentir la enorme pérdida de nuestro planeta Tierra. Debemos vivir el luto colectivo de un mundo que amamos y que nunca va a volver a ser igual. Tenemos que llorar por nuestro futuro y el de nuestros hijos. Cuando abrimos la puerta a todos esos sentimientos intensos y complejos, nos llenan de energía y de ganas de actuar. Aceptar nuestra tristeza profunda, sin evitarla ni racionalizarla, es la clave para frenar el desastre.
No sé cómo vivir al borde del colapso planetario. No sé cómo continuar creyendo en mi trabajo cuando me siento tan cansada y apenada. A veces, intento consolarme pensando que la muerte forma parte de la vida: que igual que no pudimos salvar a mi padre, no podemos salvar el planeta. Pero en esos momentos de intenso dolor también siento esperanza. Quizás, si conseguimos que nuestra pena compartida nos despierte, encontraremos la fuerza necesaria para actuar urgentemente y salvar la Tierra y a nosotros mismos.`;

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
    margin: 90px 0;
  }
`;
const Faint = styled.span`
  color: ${Colors.Primary};
  font-family: 'Poppins', sans-serif;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;

  @media ${devices.laptop} {
    flex-direction: row;
  }
`;

const StepNumber = styled.div`
  display: flex;
  align-items: center;
  padding-right: 20px;
  font-size: 24px;
  margin-bottom: 15px;

  @media ${devices.laptop} {
    font-size: 48px;
    justify-content: center;
    margin-bottom: 0px;
  }
`;

const StepTitle = styled.h5`
  font-size: 18px;
  margin: 0;
`;

const Example = styled.div`
  margin: 10px 0 30px 0;
  white-space: pre-wrap;
  border-radius: 5px;
  padding: 30px;
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