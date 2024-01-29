import { Link, MetaFunction } from "@remix-run/react";
import { Col, Container, Row } from "~/components/Grid";

export const meta: MetaFunction = () => [
  { title: "How to Search - Level Playing Field" },
  { name: "description", content: "A bit of help and advice on how to use the Level Playing Field search engine" },
];

export default function SearchHelp() {
  return (
    <Container>
      <Row>
        <Col>
          <p>
            <h2 id="how-to-search-on-level-playing-field">How to search on Level Playing Field</h2>
          </p>
          <p>
            <p>
              Level Playing Field is composed of cases and parties to cases. You can search by party or by case. Every
              party has a summary page and every case has a details page. You switch between party and case search by
              toggling the button to the left of the search bar.
            </p>
          </p>
          <p>
            <p>You can filter your search results by typing the following modifiers to any search:</p>
          </p>
          <p>
            <h3 id="for-case-search">For case search:</h3>
          </p>
          <ul>
            <li>
              <p>
                <Link to="/search?q=is:case filed:1/1/2014-12/31/2014">filed:mm/dd/yyyy-mm/dd/yyyy</Link>
              </p>
            </li>
            <li>
              <p>
                <Link to="/search?q=is:case closed:1/1/2014-12/31/2014">closed:mm/dd/yyyy-mm/dd/yyyy</Link>
              </p>
            </li>
            <li>
              <p>
                <Link to="/search?q=is:case state:CA">state:CA</Link>
              </p>
            </li>
            <li>
              <p>Dispute Types</p>
              <ul>
                <li>
                  <Link to="/search?q=is:case type:consumer">type:consumer</Link>
                </li>
                <li>
                  <Link to="/search?q=is:case type:employment">type:employment</Link>
                </li>
              </ul>
            </li>
            <li>
              <p>
                Dispositions (Limits case results to a case’s final disposition. Otherwise all dispositions are shown.)
              </p>
              <ul>
                <li>
                  <Link to="/search?q=is:case disposition:awarded">disposition:awarded</Link>{" "}
                </li>
                <li>
                  <Link to="/search?q=is:case disposition:settled">disposition:settled</Link>
                </li>
                <li>
                  <Link to="/search?q=is:case disposition:withdrawn">disposition:withdrawn</Link>{" "}
                </li>
                <li>
                  <Link to="/search?q=is:case disposition:impasse">disposition:impasse</Link>
                </li>
                <li>
                  <Link to="/search?q=is:case disposition:administrative">disposition:administrative</Link>{" "}
                </li>
                <li>
                  <Link to="/search?q=is:case disposition:dismissed">disposition:dismissed</Link>
                </li>
              </ul>
            </li>
            <li>
              <p>Awarded Party</p>
              <ul>
                <li>
                  <Link to="/search?q=is:case awarded:Consumer">awarded:Consumer</Link>
                </li>
                <li>
                  <Link to="/search?q=is:case awarded:Unknown">awarded:Unknown</Link>
                </li>
                <li>
                  <Link to="/search?q=is:case awarded:Business">awarded:Business</Link>
                </li>
                <li>
                  <Link to='/search?q=is:case awarded:"Home Owner"'>awarded:&quot;Home Owner&quot;</Link>
                </li>
                <li>
                  <Link to="/search?q=is:case awarded:Employee">awarded:Employee</Link>
                </li>
                <li>
                  <Link to='/search?q=is:case awarded:"Consumer/Business"'>awarded:&quot;Consumer/Business&quot;</Link>
                </li>
                <li>
                  <Link to='/search?q=is:case awarded:"Home Owner/Business"'>
                    awarded:&quot;Home Owner/Business&quot;
                  </Link>
                </li>
                <li>
                  <Link to='/search?q=is:case awarded:"Employee/Business"'>awarded:&quot;Employee/Business&quot;</Link>
                </li>
              </ul>
            </li>
          </ul>
          <h3 id="for-party-search">For party search:</h3>
          <ul>
            <li>
              <Link to="/search?q=is:party is:attorney">is:attorney</Link>
            </li>
            <li>
              <Link to="/search?q=is:party is:lawfirm">is:lawfirm</Link>
            </li>
            <li>
              <Link to="/search?q=is:party is:arbitrator">is:arbitrator</Link>
            </li>
            <li>
              <Link to="/search?q=is:party is:nonconsumer">is:nonconsumer</Link>
            </li>
          </ul>
          <p>
            Or you can search for specific parties by name using
            <Link to="/search?q=is:party party:”Wells Fargo Bank”">party:”Wells Fargo Bank”</Link>
          </p>
          <h2 id="sample-compound-queries">Sample Compound Queries</h2>
          <ol>
            <li>Here is an example query searching for Wells Fargo, limited to California, and closed during 2016</li>
          </ol>
          <ul>
            <li>
              <Link to="/search?q=Wells Fargo is:case state:CA closed:1/1/2016-12/31/2016">
                Wells Fargo is:case state:CA closed:1/1/2016-12/31/2016
              </Link>
            </li>
          </ul>
          <ol start={2}>
            <li>Here is a modified version of the above, limited to only awarded dispositions</li>
          </ol>
          <ul>
            <li>
              <Link to="/search?q=Wells Fargo is:case state:CA closed:1/1/2016-12/31/2016 disposition:awarded">
                Wells Fargo is:case state:CA closed:1/1/2016-12/31/2016 disposition:awarded
              </Link>
            </li>
          </ul>
          <ol start={3}>
            <li>Here is a search for all known parties matching &quot;Wells Fargo&quot;</li>
          </ol>
          <ul>
            <li>
              <Link to="/search?q=is:party is:nonconsumer Wells Fargo">is:party is:nonconsumer Wells Fargo</Link>
            </li>
          </ul>
          <ol start={4}>
            <li>Here is a search for all Macy&#39;s employment cases:</li>
          </ol>
          <ul>
            <li>
              <Link to="/search?q=Macy&#39;s is:case is:employment">Macy&#39;s is:case type:employment</Link>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}
