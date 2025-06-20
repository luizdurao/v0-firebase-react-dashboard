"use client"

import { useState, useEffect } from "react"
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/hooks/useAuth"

interface FirestoreDocument {
  id: string
  [key: string]: any
}

export function useFirestore(collectionName: string, requiresAuth = true) {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<FirestoreDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // no auth required or user already signed-in?
    if (requiresAuth && !user) {
      setLoading(false)
      setError("Faça login para acessar os dados.")
      return
    }

    setError(null)
    setLoading(true)

    const q = collection(db, collectionName)
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            ...data,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : (data.createdAt ?? new Date()),
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : (data.updatedAt ?? new Date()),
          }
        })
        setDocuments(docs)
        setLoading(false)
      },
      (err) => {
        console.error("Listener error:", err)
        if (err.code === "permission-denied") {
          setError(
            "Permissão negada pelo Firestore. Verifique as regras de segurança ou faça login com uma conta autorizada.",
          )
        } else setError(err.message)
        setLoading(false)
      },
    )

    return () => unsub()
  }, [collectionName, user, requiresAuth])

  /* ——— CRUD helpers (same as antes) ——— */
  const addDocument = async (data: any) =>
    addDoc(collection(db, collectionName), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
  const updateDocument = async (id: string, data: any) =>
    updateDoc(doc(db, collectionName, id), { ...data, updatedAt: serverTimestamp() })
  const deleteDocument = async (id: string) => deleteDoc(doc(db, collectionName, id))
  const queryDocuments = async (field: string, op: any, value: any) => {
    const snap = await getDocs(query(collection(db, collectionName), where(field, op, value)))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  }

  return { documents, loading, error, addDocument, updateDocument, deleteDocument, queryDocuments }
}
