// Script para testar a conexão com o Cloud Firestore

import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore"

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

async function testFirestoreConnection() {
  try {
    console.log("🔥 Testando conexão com Cloud Firestore...")
    console.log(`📋 Projeto: ${firebaseConfig.projectId}`)

    // Testar leitura da coleção
    console.log("\n📖 Testando leitura da coleção 'hospitais'...")
    const snapshot = await getDocs(collection(db, "hospitais"))

    console.log(`✅ Conexão bem-sucedida!`)
    console.log(`📊 Documentos encontrados: ${snapshot.size}`)

    if (snapshot.empty) {
      console.log("\n📝 A coleção está vazia. Adicionando documento de teste...")

      // Adicionar documento de teste
      const testDoc = {
        nome: "Teste de Conexão",
        tipo: "teste",
        timestamp: serverTimestamp(),
        dados: {
          status: "conectado",
          versao: "1.0",
        },
      }

      const docRef = await addDoc(collection(db, "hospitais"), testDoc)
      console.log(`✅ Documento de teste adicionado com ID: ${docRef.id}`)
    } else {
      console.log("\n📋 Documentos existentes:")
      snapshot.docs.forEach((doc, index) => {
        console.log(`${index + 1}. ID: ${doc.id}`)
        const data = doc.data()
        console.log(`   Dados: ${JSON.stringify(data, null, 2).substring(0, 100)}...`)
      })
    }

    console.log("\n🎉 Teste concluído com sucesso!")
  } catch (error) {
    console.error("❌ Erro ao conectar com Firestore:", error)

    if (error.code === "permission-denied") {
      console.log("\n🔒 ERRO DE PERMISSÃO:")
      console.log("As regras de segurança do Firestore estão bloqueando o acesso.")
      console.log("Para desenvolvimento, use estas regras temporárias:")
      console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`)
    }

    if (error.code === "unavailable") {
      console.log("\n🌐 ERRO DE CONECTIVIDADE:")
      console.log("Verifique sua conexão com a internet.")
    }
  }
}

testFirestoreConnection()
