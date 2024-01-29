import { PrismaClient } from "@prisma/client";
import cliProgress from "cli-progress";
import { program } from "./program";
import path from "path";
import xlsx from "xlsx";
import * as utils from "./import/utils";
import db from "~/utils/db.server";

const FISCAL_QUARTER_END_DATES = {
  q1: "03/31",
  q2: "06/30",
  q3: "09/30",
  q4: "12/31",
};

const Importers: Record<string, (row: Record<string, unknown>, importDate: string) => Promise<void>> = {
  async aaa(row, importDate) {
    const consumerAttorneyFirm = utils.cleanStr(row.CONSUMER_ATTORNEY_FIRM);
    const attorneyFirmName =
      consumerAttorneyFirm != null &&
      consumerAttorneyFirm !== "" &&
      consumerAttorneyFirm.toLowerCase() !== "attorney at law"
        ? consumerAttorneyFirm
        : `${String(utils.fixName(row.NAME_CONSUMER_ATTORNEY as string))}, Attorney at Law`;

    const unique_value = utils.buildUniqueValue(
      row.CASE_ID,
      utils.fixName(row.ARBITRATOR_NAME),
      utils.fixName(row.NAME_CONSUMER_ATTORNEY),
      attorneyFirmName,
      utils.fixName(row.NONCONSUMER)
    );

    const caseData = {
      case_id: null,
      import_date: importDate,
      unique_value: unique_value,
      case_number: row.CASE_ID,
      arbitration_board: "AAA",
      initiating_party: row.INITIATING_PARTY,
      source_of_authority: row.SOURCE_OF_AUTHORITY,
      dispute_type: row.TYPEDISPUTE,
      dispute_subtype: utils.naOr(row.DISPUTE_SUBTYPE),
      salary_range: row.SALARY_RANGE,
      prevailing_party: row.PREVAILING_PARTY,
      type_of_disposition: row.TYPE_OF_DISPOSITION,
      arb_count: utils.nonNaN(utils.integer(row.NO_OF_CASES_INVOLVING_BUSINESS)),
      med_count: utils.nonNaN(utils.integer(row.NO_OF_MEDCASES_NONCONS)),
      arb_or_cca_count: utils.nonNaN(utils.integer(row.NO_OF_ARBORCCACASES_NONCONS)),
      filing_date: utils.date(row.FILING_DATE),
      close_date: utils.date(row.CLOSEDATE),
      claim_amount_business: utils.money(row.CLAIM_AMT_BUSINESS),
      fee_allocation_business: utils.percent(utils.naOr(row.FEEALLOCATION_BUSINESS)),
      fees_business: utils.nonNaN(
        ((utils.money(row.TOTAL_FEE) || 0) * (utils.percent(row.FEEALLOCATION_BUSINESS) || 0)) / 100
      ),
      award_amount_business: utils.money(row.AWARD_AMT_BUSINESS),
      attorney_fees_business: utils.money(row.ATTORNEYFEE_BUSINESS),
      other_relief_business: row.OTHERRELIEF_BUSINESS,
      claim_amount_consumer: utils.money(row.CLAIM_AMT_CONSUMER),
      fee_allocation_consumer: utils.percent(utils.naOr(row.FEEALLOCATION_CONSUMER)),
      fees_consumer: utils.nonNaN(
        ((utils.money(row.TOTAL_FEE) || 0) * (utils.percent(row.FEEALLOCATION_CONSUMER) || 0)) / 100
      ),
      award_amount_consumer: utils.money(row.AWARD_AMT_CONSUMER),
      attorney_fees_consumer: utils.money(row.ATTORNEYFEE_CONSUMER),
      other_relief_consumer: row.OTHERRELIEF_CONSUMER,
      consumer_rep_state: row.CONSUMER_REP_STATE,
      consumer_self_represented: utils.bool(row.CONSUMER_SELF_REPRESENTED || false),
      document_only_proceeding: utils.bool(row.DOCUMENT_ONLY_PROCEEDING || false),
      type_of_hearing: row.TYPE_OF_HEARING,
      hearing_addr1: utils.naOr(row.HEARING_ADDR1),
      hearing_addr2: utils.naOr(row.HEARING_ADDR2),
      hearing_city: utils.naOr(row.HEARING_CITY),
      hearing_state: utils.naOr(row.HEARING_STATE),
      hearing_zip: utils.naOr(row.HEARING_ZIP),
      adr_process: row.ADR_PROCESS,
    };

    utils.validateCaseData(caseData);

    db.cases.count({ where: { unique_value } });
  },
};

program
  .command("import")
  .argument("<files...>", "xls[x] files to import")
  .action(async function (files) {
    const bars = new cliProgress.MultiBar({ format: " Importing... {bar} | {value}/{total}" });
    const fileBar = bars.create(files.length, 0, { title: "Importing files" });

    for (const filename of files) {
      const [, board, year, quarter] = /(\w+)-(\d+)-(q\d+)\.xlsx?$/.exec(path.basename(filename))!;
      const importer = Importers[board.toLowerCase()];
      const importDate = `${FISCAL_QUARTER_END_DATES[quarter.toLowerCase()]}/${year}`;

      const workbook = xlsx.readFile(filename);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const rows = xlsx.utils.sheet_to_json(worksheet) as Record<string, unknown>[];

      const rowBar = bars.create(
        rows.length,
        0,
        { title: path.basename(filename) },
        { format: " {title} | {bar} | {value}/{total}", fps: 10 }
      );
      let errors = 0;
      for (const row of rows) {
        try {
          await importer(row, importDate);
        } catch (e) {
          rowBar.update({ errors: ++errors });
        }

        rowBar.increment();
      }
      rowBar.stop();

      fileBar.increment();
    }

    bars.stop();
  });
