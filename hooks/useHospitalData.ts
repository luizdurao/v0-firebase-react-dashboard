"use client"

import { useState, useEffect } from "react"
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Patient, Doctor, Department } from "@/types/hospital"

export function useHospitalData() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribeHospitals = onSnapshot(
      collection(db, "hospitais"),
      (snapshot) => {
        try {
          const hospitalsData = snapshot.docs.map((doc) => {
            const data = doc.data()
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
              updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
            }
          })

          // Separar os dados por tipo se o campo 'type' existir
          const patientsData = hospitalsData.filter(
            (item) => item.type === "patient" || (!item.type && item.name && item.age), // Fallback para dados sem tipo mas com estrutura de paciente
          ) as Patient[]

          const doctorsData = hospitalsData.filter(
            (item) => item.type === "doctor" || (!item.type && item.specialization),
          ) as Doctor[]

          const departmentsData = hospitalsData.filter(
            (item) => item.type === "department" || (!item.type && item.capacity),
          ) as Department[]

          setPatients(patientsData)
          setDoctors(doctorsData)
          setDepartments(departmentsData)
          setLoading(false)
        } catch (err) {
          console.error("Error processing hospital data:", err)
          setError(err instanceof Error ? err.message : "Error processing data")
          setLoading(false)
        }
      },
      (err) => {
        console.error("Firebase error:", err)
        setError(err.message)
        setLoading(false)
      },
    )

    return () => {
      unsubscribeHospitals()
    }
  }, [])

  const addPatient = async (patientData: Omit<Patient, "id" | "createdAt" | "updatedAt">) => {
    try {
      await addDoc(collection(db, "hospitais"), {
        ...patientData,
        type: "patient",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    } catch (err) {
      console.error("Error adding patient:", err)
      setError(err instanceof Error ? err.message : "Failed to add patient")
    }
  }

  const updatePatient = async (id: string, patientData: Partial<Patient>) => {
    try {
      await updateDoc(doc(db, "hospitais", id), {
        ...patientData,
        updatedAt: new Date(),
      })
    } catch (err) {
      console.error("Error updating patient:", err)
      setError(err instanceof Error ? err.message : "Failed to update patient")
    }
  }

  const deletePatient = async (id: string) => {
    try {
      await deleteDoc(doc(db, "hospitais", id))
    } catch (err) {
      console.error("Error deleting patient:", err)
      setError(err instanceof Error ? err.message : "Failed to delete patient")
    }
  }

  const getPatientsByDepartment = async (department: string) => {
    try {
      const q = query(
        collection(db, "hospitais"),
        where("department", "==", department),
        where("status", "==", "Active"),
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Patient[]
    } catch (err) {
      console.error("Error fetching patients by department:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch patients by department")
      return []
    }
  }

  return {
    patients,
    doctors,
    departments,
    loading,
    error,
    addPatient,
    updatePatient,
    deletePatient,
    getPatientsByDepartment,
  }
}
