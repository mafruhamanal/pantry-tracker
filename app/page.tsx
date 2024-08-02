'use client';

import { Container, Stack, Button, Text, Group, Card, Image, Modal, TextInput, NumberInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { firestore } from '@/Firebase';
import { doc, collection, DocumentData, getDocs, getDoc, query, QuerySnapshot, deleteDoc, setDoc } from 'firebase/firestore';
import { Header } from './components/Header';
import './globals.css';
import { SearchForm } from './components/SearchForm';

interface inventory {
  name: string,
  quantity: number
}

export default function Home() {
  const [inventory, setInventory] = useState<inventory[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<inventory[]>([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState<number>(0);
  const [opened, { open, close }] = useDisclosure(false);

  const handleSearch = (query: string) => {
    if (query.trim() === '') {
      setFilteredInventory(inventory);
    } else {
      setFilteredInventory(inventory.filter(item => item.name.toLowerCase().includes(query.toLowerCase())));
    }
  }

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "pantry"));
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
    setFilteredInventory(inventoryList);
  };

  const removeItem = async (item: string) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      }
      else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  }

  const directRemoveItem = async (item: string) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef);
    }

    await updateInventory();
  }

  const addItem = async (item: string) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    }

    await updateInventory();
  }
  const addNewItem = async (item: string, quantities: number) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + quantities });
    }
    else {
      await setDoc(docRef, { quantity: quantities });
    }

    await updateInventory();
  }

  useEffect(() => {
    updateInventory();
  }, []);

  return (
    <>
      <Header />
      <Stack justify="center" h={200} align='center'>
        <Text className=' text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-green-100 mb-4 text-4xl text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl'>
          Pantry Tracker</Text>
        <SearchForm onSearch={handleSearch} />
        <Modal opened={opened} onClose={close} title="Add an Item" centered size="md">
          <TextInput
            size="md"
            radius="lg"
            label="Item Name"
            placeholder="Apple"
            className='py-4'
            value={itemName}
            onChange={(event) => setItemName(event.currentTarget.value)}
          />
          <NumberInput
            size="md"
            label="Quantity"
            placeholder="0"
            min={0}
            className='py-4'
            value={quantity}
            onChange={(value: number | string) => setQuantity(typeof value === 'number' ? value : 0)}
          />
          <Container className="flex justify-center">
            <Button
              component="a"
              color="pink"
              variant="light"
              mt="sm"
              className='self-auto'
              onClick={async () => {
                await addNewItem(itemName, quantity);
                close();
              }}
            >
              Add to Pantry
            </Button>
          </Container>
        </Modal>
        <Button
          component="a"
          color="green"
          variant="light"
          mt="sm"
          onClick={open}
          justify="center"
          className='flex flex-wrap px-12'
        >
          Add a New Item
        </Button>
      </Stack>
      {filteredInventory.map(({ name, quantity }) => (
        <Stack key={name} justify="center" h={120} align='center'>
          <Group gap="xs" h={500} align="center" bg="var(--mantine-color-body)" justify="center">
            <Card className="rounded-lg p-4 mt-4"
              padding="lg"
              radius="md"
              withBorder
              style={{ width: '500px', height: 'auto' }} >
              <Group align="center" style={{ height: '100%' }}>
                <Group style={{ flexGrow: 1, justifyContent: 'center', textAlign: 'center' }}>
                  <Text ta="center" className='px-6'>{name}</Text>
                  <Text ta="center" className='px-6'>{quantity}</Text>
                </Group>
                <Group style={{ marginTop: 'auto' }}>
                  <Button component="a" color="green" variant="light" onClick={() => addItem(name)}>
                    +
                  </Button>
                  <Button component="a" color="orange" variant="light" onClick={() => removeItem(name)} >
                    -
                  </Button>
                  <Button component="a" color="red" variant="light" onClick={() => directRemoveItem(name)}>
                    Remove
                  </Button>
                </Group>
              </Group>
            </Card>
          </Group>
        </Stack>
      ))}
    </>
  );
}
