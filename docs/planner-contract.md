# CeylonGo Planner Contract

## Purpose
Generate an editable day-by-day Sri Lanka travel itinerary using
the user's interests, available days, and total group budget.

## Proposed endpoint
POST /api/trips/plan

Authentication: required.
The backend gets the user identity from the authentication token.

## Request example
{
  "startTownId": "colombo",
  "travelerCount": 3,
  "budgetLkr": 30000,
  "days": 2,
  "interests": ["nature", "culture"]
}

## Input rules
- startTownId must reference a supported starting town.
- travelerCount and days must be positive integers.
- budgetLkr must be a positive number representing the whole group's budget.
- interests must contain at least one supported interest.
- The team must agree on supported towns, interest IDs, and maximum limits.
- Initial transport assumption: one private vehicle for the group.
- The request does not automatically save a trip.

## Successful response structure
- status: "feasible"
- currency: "LKR"
- itinerary: ordered days, each containing:
  - dayNumber
  - stops: ordered destinations with destinationId, arrivalTime,
    visitMinutes, and estimatedEntranceCostLkr for the whole group
  - legs: travel segments with fromId, toId, travelMinutes,
    and estimatedVehicleCostLkr for the whole group
  - estimatedMealCostLkr for the whole group
- costBreakdown:
  - entranceLkr
  - mealsLkr
  - vehicleLkr
  - accommodationLkr
  - totalLkr
- assumptions: travel and cost assumptions used
- warnings: limitations or missing information

Times use Sri Lanka local time in HH:mm format.
Costs are estimates, not booking prices.

## Infeasible response
A valid request that cannot fit the budget or available time returns:
- status: "infeasible"
- itinerary: []
- reasons: explanations of the constraints that could not be satisfied
- suggestions: possible changes to budget, days, or destinations

Do not present an over-budget itinerary as feasible.

## Cost rules
- Entrance cost = per-person entrance fee × traveler count.
- Meal cost = per-person meal estimate × traveler count.
- Vehicle cost is shared and counted once per travel segment.
- Accommodation, when required, must be included using an agreed
  group estimate and number of nights.
- Total cost equals the sum of all cost categories.
- A feasible plan must have totalLkr <= budgetLkr.
- Missing costs must not silently be treated as zero.

## Planning rules
- Use curated destination data and estimated travel times.
- Rank destinations by matching interests.
- Include travel time and visit duration in each day's schedule.
- Avoid duplicate destinations.
- The team must agree on daily start/end times and whether the
  itinerary returns to the starting town.
- Clearly report missing route or cost data.

## Responsibilities
- Frontend: collect inputs and display itinerary, costs, and warnings.
- Backend: authenticate, validate requests, supply data, and save trips.
- Planning developer: rank destinations, schedule visits, and calculate costs.
- AI assistance is optional and must not override validated costs
  or feasibility checks.

  ## Proposed version 1 planning assumptions

These defaults require team agreement before implementation.

- A trip starts from the selected town and returns there on the final day.
- Each day runs from 08:00 to 18:00, including travel and visits.
- Reserve 60 minutes each day for lunch.
- Schedule visits within each destination's opening hours.
- Use one private vehicle for the group.
- Include every travel segment, including travel to accommodation
  and the final return journey.
- A trip of N days includes N - 1 overnight stays.
- Use curated accommodation estimates for the whole group,
  accounting for traveler count and room capacity.
- Use curated meal, entrance, vehicle, and accommodation estimates.
- Every cost record must include its source and last-updated date.
- Missing required travel or cost data prevents a plan from being
  marked feasible.
- Personalization initially uses interest matching to rank destinations.
- Budget and schedule checks determine feasibility.
- Optional AI assistance may explain recommendations, but must not
  change validated costs or schedules.
- Adding, removing, or reordering stops triggers recalculation
  of travel times, schedules, and costs.