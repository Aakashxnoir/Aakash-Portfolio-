import Container from "../Container";
import RecognitionList from "../RecognitionList";
import Section from "../Section";
import { recognition } from "@/content/about";

export default function RecognitionStrip() {
  return (
    <Container>
      <Section id="recognition-heading" heading={recognition.heading}>
        <RecognitionList />
      </Section>
    </Container>
  );
}
