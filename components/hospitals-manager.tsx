"use client"

import { useState, useEffect } from "react"

interface RegionData {
  region: string
  totalBeds: number
  availableBeds: number
  occupancyRate: number
}

const HospitalsManager = () => {
  const [regionalData, setRegionalData] = useState<RegionData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Simulate fetching regional hospital data from an API
        // Replace this with your actual API endpoint
        const response = await new Promise<RegionData[]>((resolve) => {
          setTimeout(() => {
            const mockData: RegionData[] = [
              { region: "North", totalBeds: 500, availableBeds: 100, occupancyRate: 0.8 },
              { region: "South", totalBeds: 750, availableBeds: 250, occupancyRate: 0.67 },
              { region: "East", totalBeds: 600, availableBeds: 50, occupancyRate: 0.92 },
              { region: "West", totalBeds: 400, availableBeds: 150, occupancyRate: 0.63 },
            ]
            resolve(mockData)
          }, 1000) // Simulate a 1-second delay
        })

        setRegionalData(response)
        setError(null)
      } catch (err: any) {
        setError("Failed to fetch regional data.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div>Loading regional data...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h2>Regional Hospital Data</h2>
      <table>
        <thead>
          <tr>
            <th>Region</th>
            <th>Total Beds</th>
            <th>Available Beds</th>
            <th>Occupancy Rate</th>
          </tr>
        </thead>
        <tbody>
          {regionalData.map((regionData) => (
            <tr key={regionData.region}>
              <td>{regionData.region}</td>
              <td>{regionData.totalBeds}</td>
              <td>{regionData.availableBeds}</td>
              <td>{(regionData.occupancyRate * 100).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default HospitalsManager
