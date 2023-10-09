import dayjs from "dayjs";

const yearlyTaxBaseComponent = 50
// const registeringTaxBaseComponent = 300

export const calculateVehicleYearlyTax = (co2Emissions: number, carMass: number, nedc: boolean, year: dayjs.Dayjs) => {

  let co2 = 0;
  let weight = 0;

  co2Emissions = nedc ? co2Emissions * 1.24 : co2Emissions

  if (co2Emissions >= 118 && co2Emissions <= 150) {
    co2 = 3 * (co2Emissions - 117)
  } else if (co2Emissions >= 151 && co2Emissions <= 200) {
    co2 = 3 * (150 - 117) + 3.5 * (co2Emissions - 150)
  } else if (co2Emissions >= 201) {
    co2 = 3 * (150 - 117) + 3.5 * (200 - 150) + 4 * (co2Emissions - 200)
  }

  const weightLimit = co2Emissions === 0 ? 2400 : 2000
  const weightComponentLimit = co2Emissions === 0 ? 440 : 400

  if (carMass > weightLimit) {
    const weightComponent = (carMass - weightLimit) * 0.4
    weight = weightComponent > weightComponentLimit ? weightComponentLimit : weightComponent
  }

  const now = dayjs()
  const carAge = now.diff(year, 'year')
 
  let ageCoefficent = 1
  if (carAge >= 5 && carAge <= 14) {
    ageCoefficent = 1 - (0.09 * (carAge - 4))
  } else if (carAge > 14 && carAge <= 20) {
    ageCoefficent = 0.1
  } else if (carAge > 20) {
    ageCoefficent = 0
  }

  return {
    totalValue: yearlyTaxBaseComponent + ((co2 + weight) * ageCoefficent),
    base: yearlyTaxBaseComponent,
    co2: co2 * ageCoefficent,
    weight: weight * ageCoefficent
  }
}

// export const calculateVehicleRegisteringTax = (co2Emissions: number, carMass: number, nedc: boolean) => {
//   let taxValue = 0
//   taxValue += registeringTaxBaseComponent

//   co2Emissions = nedc ? co2Emissions * 1.24 : co2Emissions
//   if (co2Emissions >= 0 && co2Emissions <= 117) {
//     taxValue += 5 * co2Emissions
//   } else if (co2Emissions >= 118 && co2Emissions <= 150) {
//     taxValue += 40 * (co2Emissions - 117)
//   } else if (co2Emissions >= 151 && co2Emissions <= 200) {
//     taxValue += 60 * (co2Emissions - 150)
//   } else if (co2Emissions >= 201) {
//     taxValue += 80 * (co2Emissions - 200)
//   }

//   const weightLimit = co2Emissions === 0  ? 2400 : 2000
//   const weightComponentLimit = co2Emissions === 0  ? 4400 : 4000

//   if (carMass > weightLimit) {
//     const weightComponent = (carMass - weightLimit) * 4
//     taxValue += weightComponent > weightComponentLimit ? weightComponentLimit : weightComponent
//   }

//   return taxValue
// }

