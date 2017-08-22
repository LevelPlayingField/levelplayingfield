## How to search on Level Playing Field

Level Playing Field is composed of cases and parties to cases.  Every party has a summary page, which also shows up in search results unless you use a search modifier that limits results to cases.  And vis-versa, you can use a search modifier that limits your results to party pages (e.g. the business, the arbitrator and the attorneys).

The following query modifiers can be used in any combination if a space is placed between each modifier.  Only one modifier from each group can be used at a time:
* [is:case](/search?q=is:case)
* [is:party](/search?q=is:party)

You can search for cases more specfically using these modifiers:

* [filed:mm/dd/yyyy-mm/dd/yyyy](/search?q=is:case filed:1/1/2014-12/31/2014)
* [closed:mm/dd/yyyy-mm/dd/yyyy](/search?q=is:case closed:1/1/2014-12/31/2014)
* [state:CA](/search?q=is:case state:CA)
* Dispositions (Limits case results to a case’s final disposition. Otherwise all dispositions are shown.)
  * [disposition:awarded](/search?q=is:case disposition:awarded) 
  * [disposition:settled](/search?q=is:case disposition:settled)
  * [disposition:withdrawn](/search?q=is:case disposition:withdrawn)	
  * [disposition:impasse](/search?q=is:case disposition:impasse)
  * [disposition:administrative](/search?q=is:case disposition:administrative)	
  * [disposition:dismissed](/search?q=is:case disposition:dismissed)
* Awarded Party
  * [awarded:Consumer](/search?q=is:case awarded:Consumer)
  * [awarded:Unknown](/search?q=is:case awarded:Unknown)
  * [awarded:Business](/search?q=is:case awarded:Business)
  * [awarded:"Home Owner"](/search?q=is:case awarded:"Home Owner")
  * [awarded:Employee](/search?q=is:case awarded:Employee)
  * [awarded:"Consumer/Business"](/search?q=is:case awarded:"Consumer/Business")
  * [awarded:"Home Owner/Business"](/search?q=is:case awarded:"Home Owner/Business")
  * [awarded:"Employee/Business"](/search?q=is:case awarded:"Employee/Business")

Additionally, you may search for only specific type of parties using the following modifiers

* [is:attorney](/search?q=is:party is:attorney)
* [is:lawfirm](/search?q=is:party is:lawfirm)
* [is:arbitrator](/search?q=is:party is:arbitrator)
* [is:nonconsumer](/search?q=is:party is:nonconsumer)

Or you can search for specific parties by name using 
 [party:”Wells Fargo Bank”](/search?q=is:party party:”Wells Fargo Bank”)

## Sample Compound Queries

1. Here is an example query searching for Wells Fargo, limited to California, and closed during 2016
  * [Wells Fargo is:case state:CA closed:1/1/2016-12/31/2016](/search?q=Wells Fargo is:case state:CA closed:1/1/2016-12/31/2016)
1. Here is a modified version of the above, limited to only awarded dispositions
  * [Wells Fargo is:case state:CA closed:1/1/2016-12/31/2016 disposition:awarded](/search?q=Wells Fargo is:case state:CA closed:1/1/2016-12/31/2016 disposition:awarded)
1. Here is a search for all known parties matching "Wells Fargo"
  * [is:nonconsumer Wells Fargo](/search?q=is:nonconsumer Wells Fargo)
