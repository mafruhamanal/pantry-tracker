"use client";

import { Container, Stack, Text, Loader } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
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
}

export default function Home() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>(
    []
  );
  const [loading, setLoading] = useState(true); // Loading state for authentication check
  const [authenticated, setAuthenticated] = useState<boolean>(false); // Authenticated state
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth/create"); // Redirect to sign-up page if not authenticated
      } else {
        setAuthenticated(true); // Set authenticated to true
        updateInventory(); // Update inventory if authenticated
      }
      setLoading(false); // Set loading to false after check
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
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

  if (loading) {
    return <Loader size="lg" />; // Show a loading spinner while checking authentication
  }

  if (!authenticated) {
    return null; // Render nothing if not authenticated
  }

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
