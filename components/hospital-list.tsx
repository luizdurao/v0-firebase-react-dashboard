"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface HospitalListProps {
  hospitals: any[]
}

export default function HospitalList({ hospitals }: HospitalListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.region.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hospital Directory</CardTitle>
        <CardDescription>Comprehensive list of hospitals across Brazil</CardDescription>
        <div className="mt-2">
          <Input
            placeholder="Search hospitals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hospital Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-right">Beds</TableHead>
                <TableHead className="text-right">Occupancy</TableHead>
                <TableHead className="text-right">Doctors</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHospitals.length > 0 ? (
                filteredHospitals.map((hospital) => (
                  <TableRow key={hospital.id}>
                    <TableCell className="font-medium">{hospital.name}</TableCell>
                    <TableCell>{hospital.region}</TableCell>
                    <TableCell>{hospital.city}</TableCell>
                    <TableCell className="text-right">{hospital.beds}</TableCell>
                    <TableCell className="text-right">{hospital.occupancy}%</TableCell>
                    <TableCell className="text-right">{hospital.doctors}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No hospitals found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
