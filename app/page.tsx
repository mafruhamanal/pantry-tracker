"use client";

import { Container, Stack, Text, Loader } from "@mantine/core";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { firestore, auth } from "@/Firebase";
import {
  doc,
  collection,
  getDocs,
  getDoc,
  query,
  QuerySnapshot,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { Header } from "./components/Header";
import "./globals.css";
import { SearchForm } from "./components/SearchForm";
import { Inventory } from "./components/Inventory";

interface InventoryItem {
  name: string;
  quantity: number;
  imageURL?: string;
}

export default function Home() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth/create");
      } else {
        setAuthenticated(true);
        updateInventory();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSearch = (query: string) => {
    if (query.trim() === "") {
      setFilteredInventory(inventory);
    } else {
      setFilteredInventory(
        inventory.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  const updateInventory = async () => {
    if (!auth.currentUser) return;

    const snapshot = query(
      collection(firestore, `users/${auth.currentUser?.uid}/inventory`)
    );
    const docsRef: QuerySnapshot = await getDocs(snapshot);
    const inventoryList: InventoryItem[] = [];
    docsRef.forEach((doc) => {
      const data = doc.data();
      inventoryList.push({
        name: doc.id,
        quantity: data.quantity,
        imageURL: data.imageURL,
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const removeItem = async (item: InventoryItem) => {
    const docRef = doc(
      collection(firestore, `users/${auth.currentUser?.uid}/inventory`),
      item.name
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          quantity: quantity - 1,
          imageURL: item.imageURL,
        });
      }
    }

    await updateInventory();
  };

  const directRemoveItem = async (item: InventoryItem) => {
    const docRef = doc(
      collection(firestore, `users/${auth.currentUser?.uid}/inventory`),
      item.name
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef);
    }

    await updateInventory();
  };

  const addItem = async (item: InventoryItem) => {
    const docRef = doc(
      collection(firestore, `users/${auth.currentUser?.uid}/inventory`),
      item.name
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1, imageURL: item.imageURL });
    }

    await updateInventory();
  };

  const addNewItem = async (
    item: string,
    quantities: number,
    imageURL?: string 
  ) => {
    try {
      const docRef = doc(
        collection(firestore, `users/${auth.currentUser?.uid}/inventory`),
        item
      );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {

        const docData = docSnap.data();
        await setDoc(
          docRef,
          {
            quantity: (docData.quantity || 0) + quantities, 
            imageURL: imageURL ?? docData.imageURL, 
          },
          { merge: true }
        ); 
      } else {
        await setDoc(docRef, { quantity: quantities, imageURL });
      }

      await updateInventory(); 
    } catch (error) {
      console.error("Error adding new item:", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!authenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <Container mt="md">
        <Stack justify="center" align="center" className="py-4">
          <Text className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-green-100 mb-4 text-4xl text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Pantry Tracker
          </Text>
          <SearchForm onSearch={handleSearch} />
          <Inventory
            inventory={filteredInventory}
            addItem={addItem}
            removeItem={removeItem}
            directRemoveItem={directRemoveItem}
            addNewItem={addNewItem}
          />
        </Stack>
      </Container>
    </>
  );
}
