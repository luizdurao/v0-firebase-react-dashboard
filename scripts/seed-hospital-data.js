// This script seeds the Firebase database with sample hospital data
// Run this to populate your database with test data

import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDHJL2Qxl3pIlUfIzWs7hMdz6KFIrPaBPE",
  authDomain: "projetocnsaude.firebaseapp.com",
  projectId: "projetocnsaude",
  storageBucket: "projetocnsaude.firebasestorage.app",
  messagingSenderId: "814294290260",
  appId: "1:814294290260:web:08bf02614c6bdd2c1102c1",
  measurementId: "G-04EJ1RDZ1W",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const samplePatients = [
  {
    name: "John Smith",
    age: 45,
    gender: "Male",
    phone: "+1-555-0123",
    email: "john.smith@email.com",
    address: "123 Main St, City, State 12345",
    bloodType: "A+",
    emergencyContact: "+1-555-0124",
    admissionDate: "2024-01-15",
    department: "Cardiology",
    doctor: "Dr. Sarah Johnson",
    status: "Active",
    medicalHistory: ["Hypertension", "Diabetes Type 2"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Emily Davis",
    age: 32,
    gender: "Female",
    phone: "+1-555-0125",
    email: "emily.davis@email.com",
    address: "456 Oak Ave, City, State 12345",
    bloodType: "O-",
    emergencyContact: "+1-555-0126",
    admissionDate: "2024-01-20",
    department: "Pediatrics",
    doctor: "Dr. Michael Brown",
    status: "Critical",
    medicalHistory: ["Asthma"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Robert Wilson",
    age: 67,
    gender: "Male",
    phone: "+1-555-0127",
    email: "robert.wilson@email.com",
    address: "789 Pine St, City, State 12345",
    bloodType: "B+",
    emergencyContact: "+1-555-0128",
    admissionDate: "2024-01-18",
    department: "Orthopedics",
    doctor: "Dr. Lisa Anderson",
    status: "Active",
    medicalHistory: ["Arthritis", "Previous hip surgery"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const sampleDoctors = [
  {
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    phone: "+1-555-0200",
    email: "s.johnson@hospital.com",
    department: "Cardiology",
    experience: 15,
    availability: true,
  },
  {
    name: "Dr. Michael Brown",
    specialization: "Pediatrician",
    phone: "+1-555-0201",
    email: "m.brown@hospital.com",
    department: "Pediatrics",
    experience: 12,
    availability: true,
  },
  {
    name: "Dr. Lisa Anderson",
    specialization: "Orthopedic Surgeon",
    phone: "+1-555-0202",
    email: "l.anderson@hospital.com",
    department: "Orthopedics",
    experience: 18,
    availability: false,
  },
]

const sampleDepartments = [
  {
    name: "Cardiology",
    head: "Dr. Sarah Johnson",
    capacity: 50,
    currentPatients: 32,
  },
  {
    name: "Pediatrics",
    head: "Dr. Michael Brown",
    capacity: 40,
    currentPatients: 28,
  },
  {
    name: "Orthopedics",
    head: "Dr. Lisa Anderson",
    capacity: 35,
    currentPatients: 22,
  },
  {
    name: "Emergency",
    head: "Dr. James Wilson",
    capacity: 25,
    currentPatients: 15,
  },
  {
    name: "Neurology",
    head: "Dr. Maria Garcia",
    capacity: 30,
    currentPatients: 18,
  },
]

async function seedData() {
  try {
    console.log("Seeding patients...")
    for (const patient of samplePatients) {
      await addDoc(collection(db, "patients"), patient)
    }

    console.log("Seeding doctors...")
    for (const doctor of sampleDoctors) {
      await addDoc(collection(db, "doctors"), doctor)
    }

    console.log("Seeding departments...")
    for (const department of sampleDepartments) {
      await addDoc(collection(db, "departments"), department)
    }

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}

seedData()
