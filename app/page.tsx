"use client";
import { Container, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { firestore } from "@/Firebase";
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
import { auth } from "../Firebase";

interface InventoryItem {
  name: string;
  quantity: number;
}

export default function Home() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>(
    []
  );
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [opened, { open, close }] = useDisclosure(false);

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
    const snapshot = query(
      collection(firestore, `users/${auth.currentUser?.uid}/inventory`)
    );
    const docsRef: QuerySnapshot<DocumentData> = await getDocs(snapshot);
    const inventoryList: InventoryItem[] = [];
    docsRef.forEach((doc) => {
      const data = doc.data();
      inventoryList.push({
        name: doc.id,
        quantity: data.quantity,
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const removeItem = async (item: string) => {
    const docRef = doc(
      collection(firestore, `users/${auth.currentUser?.uid}/inventory`),
      item
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const directRemoveItem = async (item: string) => {
    const docRef = doc(
      collection(firestore, `users/${auth.currentUser?.uid}/inventory`),
      item
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef);
    }

    await updateInventory();
  };

  const addItem = async (item: string) => {
    const docRef = doc(
      collection(firestore, `users/${auth.currentUser?.uid}/inventory`),
      item
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    }

    await updateInventory();
  };

  const addNewItem = async (item: string, quantities: number) => {
    const docRef = doc(
      collection(firestore, `users/${auth.currentUser?.uid}/inventory`),
      item
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + quantities });
    } else {
      await setDoc(docRef, { quantity: quantities });
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  return (
    <>
      <Header />
      <Container mt="md">
        <Stack justify="center" align="center" className="py-12">
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
