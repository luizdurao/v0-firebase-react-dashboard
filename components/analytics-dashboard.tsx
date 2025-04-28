"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Loader2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import HospitalList from "@/components/hospital-list"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true)
  const [hospitalData, setHospitalData] = useState([])
  const [regionData, setRegionData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch hospital data
        const hospitalSnapshot = await getDocs(collection(db, "hospitals"))
        const hospitals = hospitalSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setHospitalData(hospitals)

        // Fetch region data
        const regionSnapshot = await getDocs(collection(db, "regions"))
        const regions = regionSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setRegionData(regions)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Prepare data for pie chart
  const regionHospitalData = regionData.map((region) => ({
    name: region.name,
    value: region.hospitals,
  }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading analytics data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Healthcare Analytics</h1>
        <p className="text-muted-foreground">Detailed analysis of healthcare infrastructure</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hospital Distribution</CardTitle>
            <CardDescription>Percentage of hospitals by region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionHospitalData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {regionHospitalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Healthcare Resources</CardTitle>
            <CardDescription>Distribution of medical professionals and beds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regionData.map((region) => (
                <div key={region.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{region.name}</span>
                    <span className="text-sm text-muted-foreground">{region.doctors.toLocaleString()} doctors</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full bg-primary" style={{ width: `${(region.doctors / 85000) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <HospitalList hospitals={hospitalData} />
    </div>
  )
}
