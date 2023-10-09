'use client'

import { useEffect, useState } from "react"
import { calculateVehicleYearlyTax } from "@/utils/calculator"
import dayjs from "dayjs"
import { PieChart } from 'react-minimal-pie-chart';


export default function Home() {

  const [electric, setElectric] = useState(false)

  const [co2Component, setCo2Component] = useState('')
  const [co2NEDC, setCo2NEDC] = useState(false)

  const [vehicleWeigth, setVehicleWeigth] = useState('')

  // const [registerTax, setRegisterTax] = useState(0)
  const [yearlyTax, setYearlyTax] = useState(0)

  const [carYear, setCarYear] = useState('')

  const [chart, setChart] = useState<{base: number, co2: number, weight: number} | null>(null)

  const format = (number: string, current: string, maxSize: number) => {
    if (number.length > maxSize) {
      return current
    }
    if (number) {
      return Math.round(parseInt(number))
    }
  }

  const round = (number: number) => {
    return Math.round(number * 100) / 100
  }

  const handleCo2Change = (event: any) => {
    const rounded = format(event.target.value, co2Component, 4)
    setCo2Component(rounded ? rounded.toString() : '')
  }

  const handleWeightChange = (event: any) => {
    const rounded = format(event.target.value, vehicleWeigth, 6)
    setVehicleWeigth(rounded ? rounded.toString() : '')
  }

  const handleElectricChange = () => {
    setCo2Component("")
    setElectric(!electric)
  }

  const handleCo2TypeChange = () => {
    setCo2NEDC(!co2NEDC)
  }

  const handleYearChange = (event: any) => {
    setCarYear(event.target.value)
  }

  useEffect(() => {
    const calculate = () => {
      if ((co2Component || electric) && vehicleWeigth && carYear) {
        // const register = calculateVehicleRegisteringTax(parseInt(co2Component), parseInt(vehicleWeigth), co2NEDC, carYear)
        const yearly = calculateVehicleYearlyTax(electric ? 0 : parseInt(co2Component), parseInt(vehicleWeigth), co2NEDC, dayjs().year(parseInt(carYear)))
        // setRegisterTax(round(register))
        setYearlyTax(round(yearly.totalValue))
        setChart(yearly)
      } else {
        // setRegisterTax(0)
        setYearlyTax(0)
        setChart(null)
      }
    }
    calculate()
  }, [co2Component, vehicleWeigth, electric, co2NEDC, carYear])

  return (
    <div className='w-full flex justify-center items-center'>
      <div className="mb-20 max-sm:mx-5 max-sm:mt-2 sm:mt-40 md:mt-80">
        <h1 className="text-6xl font-sans">Automaksu kalkulaator</h1>
        <p className="font-sans">Seisuga 9. Oktoober 2023</p>
        <div className="flex max-sm:flex-col justify-between">
          <div className='flex gap-10 flex-col mt-10'>
            <div className="flex gap-2 flex-col">
              <p className="font-sans text-xl font-medium">Elektriline</p>
              <label className="switch">
                <input type="checkbox" checked={electric} onChange={handleElectricChange}/>
                <span className="slider round"></span>
              </label>
            </div>
            { !electric &&
              <div className="flex flex-col gap-4">
                <p className="text-xl font-sans font-medium">CO<sub>2</sub> heited (g/km)</p>
                <div className="flex gap-5">
                  <p className="font-sans text-xl">WLTP</p>
                  <label className="switch">
                    <input type="checkbox" checked={co2NEDC} onChange={handleCo2TypeChange}/>
                    <span className="slider round"></span>
                  </label>
                  <p className="font-sans text-xl">NEDC</p>
                </div>
                <input 
                  className='p-2 rounded border border-solid font-sans w-[200px]'
                  value={co2Component}
                  onChange={handleCo2Change}
                  type="number"
                />
              </div>
            }
            <div className="flex flex-col gap-2">
              <p className="text-xl font-sans font-medium">Sõiduki täismass (kg)</p>
              <input 
                className='p-2 rounded border border-solid font-sans w-[200px]'
                value={vehicleWeigth}
                onChange={handleWeightChange}
                type="number"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xl font-sans font-medium">Aasta</p>
              <input 
                className='p-2 rounded border border-solid font-sans w-[200px]'
                value={carYear}
                onChange={handleYearChange}
                type="number"
              />
            </div>
            {/* <h1 className="font-sans text-3xl">Registreerimistasu <span className="font-bold">{registerTax}€</span></h1> */}
          </div>
          <div className="flex mt-10 flex-col sm:w-[300px]">
            <h1 className="font-sans text-3xl mb-5">Aastamaks <span className="font-bold">{yearlyTax}€</span></h1>
            {
              chart &&
              <PieChart
                viewBoxSize={[200, 250]}
                label={({dataEntry}) => {
                  console.log(dataEntry)
                  if (dataEntry.percentage) {
                    return `${dataEntry.title} ${round(dataEntry.value)}€`
                  }
                  return ''
                }}
                radius={100}
                center={[100, 100]}
                labelStyle={{fontSize: '12px', fill: '#fff'}}
                animate={true}
                data={[
                  { title: 'Baasosa', key: 0, value: chart.base, color: '#26547C' },
                  { title: 'CO2 osa', key: 1, value: chart.co2, color: '#06D6A0' },
                  { title: 'Massiosa', key: 2, value: chart.weight, color: '#EF476F' },
                ]}
              />
            }
          </div>
        </div>
      </div>
    </div>
  )
}
