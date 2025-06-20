export interface Patient {
  id: string
  name: string
  age: number
  gender: "Male" | "Female" | "Other"
  phone: string
  email: string
  address: string
  bloodType: string
  emergencyContact: string
  admissionDate: string
  department: string
  doctor: string
  status: "Active" | "Discharged" | "Critical"
  medicalHistory: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Doctor {
  id: string
  name: string
  specialization: string
  phone: string
  email: string
  department: string
  experience: number
  availability: boolean
}

export interface Department {
  id: string
  name: string
  head: string
  capacity: number
  currentPatients: number
}
