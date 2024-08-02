'use client';
import { Container, Stack, Button, Text, Group, Card, Image, Badge, Title } from '@mantine/core';
import { useState, useEffect } from 'react';
import {firestore} from '@/Firebase';
import { doc, collection, DocumentData, getDocs,getDoc, query, QuerySnapshot, deleteDoc, setDoc } from 'firebase/firestore';
import { Header } from './Header';
import './globals.css';

interface inventory {
  name: string,
  quantity: number
}

export default function Home() {

  const [inventory,setInventory] = useState<inventory[]>([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const demoProps = {
    bg: 'var(--mantine-color-blue-light)',
    h: 200,
    mt: 'md',
  };

  const updateInventory = async () => {
    const snapshot = query(collection(firestore,"pantry"));
    const docsRef: QuerySnapshot<DocumentData> = await getDocs(snapshot);
    const inventoryList: inventory[] = [];
    docsRef.forEach((doc) => {
      const data = doc.data();
      inventoryList.push({
        name: doc.id,
        quantity: data.quantity,
      });
    });
    setInventory(inventoryList);
  };

  const removeItem = async (item: string) => {
    const docRef = doc(collection(firestore,"pantry"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const  { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      }
      else {
        await setDoc(docRef, {quantity: quantity - 1});
      }
    }

    await updateInventory();
  }

  const addItem = async (item: string) => {
    const docRef = doc(collection(firestore,"pantry"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const  { quantity } = docSnap.data();
      await setDoc(docRef, {quantity: quantity + 1});
    }
    else {
      await setDoc(docRef, {quantity: 1});
    }

    await updateInventory();
  }
  useEffect(()=> {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
    <Header/>
    <Text className='text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-green-100 mb-4 text-4xl text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl'>
        Pantry Tracker</Text>
    { inventory.forEach(({name, quantity}) => {console.log(quantity)})}
   <Stack justify="center" h={200} align='center'>
    <Group gap="xs" h={500}  align="center"  bg="var(--mantine-color-body)" justify="center">
      <Card className="rounded-lg p-4 mt-4"
    padding="lg"
    radius="md"
    withBorder
    style={{ flex: 1 }} >
      <Group gap="xl" h={100}  align="center"  bg="var(--mantine-color-body)" justify="center">
      <Text>Item Name</Text>
      <Text>Quantity: 1</Text>
      <Button
      component="a"
      href={`/reading/test-reading`}
      color="green"
      variant="light"
      mt="sm"
    >
      Add
    </Button>
    <Button
      component="a"
      href={`/reading/test-reading`}
      color="green"
      variant="light"
      mt="sm"
    >
      Remove
    </Button>
    <Button
      component="a"
      href={`/reading/test-reading`}
      color="green"
      variant="light"
      mt="sm"
    >
      Delete
    </Button>
    </Group>
    </Card>
    </Group>
    </Stack> 
    <Stack justify="center" h={200} align='center'>
    <Group gap="xs" h={500}  align="center"  bg="var(--mantine-color-body)" justify="center">
      <Card className=" rounded-lg p-4 mt-4"
    padding="lg"
    radius="md"
    withBorder
    style={{ flex: 1 }} >
      <Group gap="xl" h={100}  align="center"  bg="var(--mantine-color-body)" justify="center">
      <Text>Item Name</Text>
      <Text>Quantity: 1</Text>
      <Button
      component="a"
      href={`/reading/test-reading`}
      color="green"
      variant="light"
      mt="sm"
    >
      Add
    </Button>
    <Button
      component="a"
      href={`/reading/test-reading`}
      color="green"
      variant="light"
      mt="sm"
    >
      Remove
    </Button>
    <Button
      component="a"
      href={`/reading/test-reading`}
      color="green"
      variant="light"
      mt="sm"
    >
      Delete
    </Button>
    </Group>
    </Card>
    </Group>
    </Stack> 
    </>
  );
}