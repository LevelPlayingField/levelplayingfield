import { MetaFunction } from "@remix-run/react";
import { Col, Container, Row } from "~/components/Grid";

export const meta: MetaFunction = () => [
  { title: "About Us - Level Playing Field" },
  {
    name: "description",
    content: "About the team of Level Playing Field. Get to know Daniel and Frank and why we're doing this",
  },
];
export default function AboutUs() {
  return (
    <Container>
      <Col>
        <Row>
          <h3 id="about-us">About Us</h3>
          <p>
            Level Playing Field is a 501(c)(3) non-profit that educates the public on forced consumer and employee
            arbitration and related issues.
          </p>
          <p>
            We leverage technology to empower individuals with disputes <em>today.</em> Not everyone can wait for the
            civil justice system to be made more fair <em>tomorrow.</em> We&#39;re fighting to put you on a more{" "}
            <em>level playing field</em> right now.
          </p>
          <p>
            We began by publishing a freely-available, continuously-updated consumer and employee arbitration case
            database. We also provide ongoing summary data analysis. Reports, expert testimony and affidavits are
            available on request.
          </p>
          <p>
            We encourage parties that have been through forced arbitration to share their stories{" "}
            <a href="https://forum.levelplayingfield.io">in our forums</a> and by commenting on their cases (which tie
            back to the forums). If you think your case might be subject to confidentiality,{" "}
            <a href="mailto:team@lpf.io?subject=About+Us+Confidentiality">ask us.</a> We&#39;ve yet to see a
            non-negotiated consumer agreement with a confidentiality clause. Employment and settlement agreements
            usually have one.
          </p>
          <p>We also encourage those with experience in dispute resolution to contribute to the forums.</p>
          <p>The more information parties share, the better off we all are.</p>
          <p>
            We now <a href="https://blog.levelplayingfield.io">publish a blog</a> where we highlight arbitration and
            related stories that we aren&#39;t seeing covered elsewhere.
          </p>
          <p>
            Finally, as a 501(c)(3), your donations are fully tax-deductible - and fully-appreciated. We have a{" "}
            <a href="https://www.patreon.com/levelplayingfield">Patreon for recurring monthly donations</a> and a{" "}
            <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&amp;hosted_button_id=J8KHLEX98Z38Y">
              Paypal for one-time donations.
            </a>
          </p>
          <p>Even one dollar a month helps. We try to offer our supporters early access to data and analysis.</p>
          <p>
            Level Playing Field is just getting started and we have plenty more big ideas to roll out as time and our
            budget allows.
          </p>
        </Row>
      </Col>
    </Container>
  );
}
