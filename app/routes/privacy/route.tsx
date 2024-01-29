import { MetaFunction } from "@remix-run/react";
import "./privacy.css";
import { Col, Container, Row } from "~/components/Grid";

export const meta: MetaFunction = () => [
  { title: "Privacy Policy" },
  { name: "description", content: "Privacy Policy and Terms of Use" },
];

export default function Privacy() {
  return (
    <Container>
      <Row>
        <Col>
          <h2 id="level-playing-field-terms-of-service-and-privacy-policy">
            Level Playing Field Terms of Service and Privacy Policy
          </h2>
          <h3 id="1-terms">1. Terms</h3>
          <p>
            By accessing the website at <a href="http://levelplayingfield.io">levelplayingfield.io</a>, you are agreeing
            to be bound by these terms of service, all applicable laws and regulations, and agree that you are
            responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you
            are prohibited from using or accessing this site. The materials contained in this website are protected by
            applicable copyright and trademark law.
          </p>
          <h3 id="2-use-license">2. Use License</h3>
          <ol>
            <li>
              Permission is granted to temporarily download one copy of the materials (information or software) on Level
              Playing Field&#39;s website for personal, non-commercial transitory viewing only. This is the grant of a
              license, not a transfer of title, and under this license you may not:
              <ol>
                <li>modify or copy the materials;</li>
                <li>
                  use the materials for any commercial purpose, or for any public display (commercial or
                  non-commercial);
                </li>
                <li>
                  attempt to decompile or reverse engineer any software contained on Level Playing Field&#39;s website;
                </li>
                <li>remove any copyright or other proprietary notations from the materials; or</li>
                <li>
                  transfer the materials to another person or &quot;mirror&quot; the materials on any other server.
                </li>
              </ol>
            </li>
            <li>
              This license shall automatically terminate if you violate any of these restrictions and may be terminated
              by Level Playing Field at any time. Upon terminating your viewing of these materials or upon the
              termination of this license, you must destroy any downloaded materials in your possession whether in
              electronic or printed format.
            </li>
          </ol>
          <h3 id="3-disclaimer">3. Disclaimer</h3>
          <ol>
            <li>
              The materials on Level Playing Field&#39;s website are provided on an &#39;as is&#39; basis. Level Playing
              Field makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties
              including, without limitation, implied warranties or conditions of merchantability, fitness for a
              particular purpose, or non-infringement of intellectual property or other violation of rights.
            </li>
            <li>
              Further, Level Playing Field does not warrant or make any representations concerning the accuracy, likely
              results, or reliability of the use of the materials on its website or otherwise relating to such materials
              or on any sites linked to this site.
            </li>
          </ol>
          <h3 id="4-limitations">4. Limitations</h3>
          <p>
            In no event shall Level Playing Field or its suppliers be liable for any damages (including, without
            limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or
            inability to use the materials on Level Playing Field&#39;s website, even if Level Playing Field or a Level
            Playing Field authorized representative has been notified orally or in writing of the possibility of such
            damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of
            liability for consequential or incidental damages, these limitations may not apply to you.
          </p>
          <h3 id="5-accuracy-of-materials">5. Accuracy of materials</h3>
          <p>
            The materials appearing on Level Playing Field&#39;s website could include technical, typographical, or
            photographic errors. Level Playing Field does not warrant that any of the materials on its website are
            accurate, complete or current. Level Playing Field may make changes to the materials contained on its
            website at any time without notice. However Level Playing Field does not make any commitment to update the
            materials.
          </p>
          <h3 id="6-links">6. Links</h3>
          <p>
            Level Playing Field has not reviewed all of the sites linked to its website and is not responsible for the
            contents of any such linked site. The inclusion of any link does not imply endorsement by Level Playing
            Field of the site. Use of any such linked website is at the user&#39;s own risk.
          </p>
          <h3 id="7-modifications">7. Modifications</h3>
          <p>
            Level Playing Field may revise these terms of service for its website at any time without notice. By using
            this website you are agreeing to be bound by the then current version of these terms of service.
          </p>
          <h3 id="8-governing-law">8. Governing Law</h3>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of Arizona and you
            irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
          <h2 id="privacy-policy">Privacy Policy</h2>
          <p>Your privacy is important to us.</p>
          <p>
            It is Level Playing Field&#39;s policy to respect your privacy regarding any information we may collect
            while operating our website. Accordingly, we have developed this privacy policy in order for you to
            understand how we collect, use, communicate, disclose and otherwise make use of personal information. We
            have outlined our privacy policy below.
          </p>
          <ul>
            <li>
              We will collect personal information by lawful and fair means and, where appropriate, with the knowledge
              or consent of the individual concerned.
            </li>
            <li>
              Before or at the time of collecting personal information, we will identify the purposes for which
              information is being collected.
            </li>
            <li>
              We will collect and use personal information solely for fulfilling those purposes specified by us and for
              other ancillary purposes, unless we obtain the consent of the individual concerned or as required by law.
            </li>
            <li>
              Personal data should be relevant to the purposes for which it is to be used, and, to the extent necessary
              for those purposes, should be accurate, complete, and up-to-date.
            </li>
            <li>
              We will protect personal information by using reasonable security safeguards against loss or theft, as
              well as unauthorized access, disclosure, copying, use or modification.
            </li>
            <li>
              We will make readily available to customers information about our policies and practices relating to the
              management of personal information.
            </li>
            <li>
              We will only retain personal information for as long as necessary for the fulfilment of those purposes.
            </li>
          </ul>
          <p>
            We are committed to conducting our business in accordance with these principles in order to ensure that the
            confidentiality of personal information is protected and maintained. Level Playing Field may change this
            privacy policy from time to time at Level Playing Field&#39;s sole discretion.
          </p>
          <h3 id="google-analytics">Google Analytics</h3>
          <p>
            Google Analytics is a web analysis service provided by Google. Google utilizes the data collected to track
            and examine the use of Level Playing Field, to prepare reports on its activities and share them with other
            Google services.
          </p>
          <p>
            Google may use the data collected to contextualize and personalize the ads of its own advertising network.
          </p>
          <p>
            Personal data collected: Cookie and Usage Data. Place of processing: USA. Find Google&#39;s privacy policy
            here:{" "}
            <a href="http://www.google.com/intl/en/policies/privacy/">
              http://www.google.com/intl/en/policies/privacy/
            </a>
          </p>
        </Col>
      </Row>
    </Container>
  );
}
