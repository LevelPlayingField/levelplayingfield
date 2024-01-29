import { cases } from "@prisma/client";
import s from "./case.module.css";
import MoneyCents from "~/components/MoneyCents";
import { PartyType, partyType } from "~/utils/cases";

export default function AwardsTable({ case_ }: { case_: cases }) {
  const initiatedBy = partyType(case_.initiating_party);
  const plaintiff = initiatedBy === PartyType.NonConsumer ? "business" : "consumer";
  const defendant = initiatedBy === PartyType.Consumer ? "business" : "consumer";

  return (
    <table className={s.table}>
      <tbody>
        <tr>
          <th>Claims & Awards</th>
          <th>{initiatedBy !== null ? "Plaintiff" : "Unknown"}</th>
          <th>{initiatedBy !== null ? "Defendant" : ""}</th>
        </tr>
        <tr>
          <td>Claim Amount</td>
          <td>
            <MoneyCents value={case_[`claim_amount_${plaintiff}`]} />
          </td>
          <td>
            <MoneyCents value={case_[`claim_amount_${defendant}`]} />
          </td>
        </tr>
        <tr>
          <td>Arbitration Fee</td>
          <td>
            <MoneyCents value={case_[`fees_${plaintiff}`]} />
          </td>
          <td>
            <MoneyCents value={case_[`fees_${defendant}`]} />
          </td>
        </tr>
        <tr>
          <td>Award Amount</td>
          <td>
            <MoneyCents value={case_[`award_amount_${plaintiff}`]} />
          </td>
          <td>
            <MoneyCents value={case_[`award_amount_${defendant}`]} />
          </td>
        </tr>
        <tr>
          <td>Attorney&apos;s Fees</td>
          <td>
            <MoneyCents value={case_[`attorney_fees_${plaintiff}`]} />
          </td>
          <td>
            <MoneyCents value={case_[`attorney_fees_${defendant}`]} />
          </td>
        </tr>
        <tr>
          <td>Total</td>
          <td />
          <td />
        </tr>
        <tr>
          <td>Other Relief</td>
          <td>{case_[`other_relief_${plaintiff}`]}</td>
          <td>{case_[`other_relief_${defendant}`]}</td>
        </tr>
      </tbody>
    </table>
  );
}
