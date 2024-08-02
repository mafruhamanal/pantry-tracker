"use client";

import {
  Container,
  Stack,
  Button,
  Text,
  Group,
  Card,
  Modal,
  TextInput,
  NumberInput,
  FileInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { storage, auth } from "@/Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./../globals.css";

interface InventoryItem {
  name: string;
  quantity: number;
  imageURL?: string;
}

interface InventoryProps {
  inventory: InventoryItem[];
  addItem: (item: InventoryItem) => Promise<void>;
  removeItem: (item: InventoryItem) => Promise<void>;
  directRemoveItem: (item: InventoryItem) => Promise<void>;
  addNewItem: (
    name: string,
    quantity: number,
    imageURL?: string
  ) => Promise<void>;
}

export function Inventory({
  inventory,
  addItem,
  removeItem,
  directRemoveItem,
  addNewItem,
}: InventoryProps) {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const handleFileChange = (file: File | null) => {
    if (file) {
      setImage(file);
    }
  };

  const handleAddNewItem = async () => {
    let imageURL: string | undefined;
    if (image) {
      try {
        const imageRef = ref(
          storage,
          `users/${auth.currentUser?.uid}/${image.name}`
        );
        await uploadBytes(imageRef, image);
        imageURL = await getDownloadURL(imageRef);
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    }
    await addNewItem(itemName, quantity, imageURL);
    close();
  };

  return (
    <>
      <Stack align="center" className="py-4">
        <Modal
          opened={opened}
          onClose={close}
          title="Add an Item"
          centered
          size="md"
        >
          <Stack>
            <TextInput
              size="md"
              radius="lg"
              label="Item Name"
              placeholder="Apple"
              value={itemName}
              onChange={(event) => setItemName(event.currentTarget.value)}
            />
            <NumberInput
              size="md"
              radius="lg"
              label="Quantity"
              placeholder="0"
              min={0}
              value={quantity}
              onChange={(value: number | string) =>
                setQuantity(typeof value === "number" ? value : 0)
              }
            />
            <FileInput
              size="md"
              radius="lg"
              label="Upload Image"
              placeholder="Select file"
              onChange={handleFileChange}
            />
            <Container className="flex justify-center">
              <Button
                color="pink"
                variant="light"
                mt="sm"
                onClick={handleAddNewItem}
              >
                Add to Pantry
              </Button>
            </Container>
          </Stack>
        </Modal>

        <Button color="green" variant="light" onClick={open}>
          Add a New Item
        </Button>

        {inventory.length > 0 ? (
          inventory.map((item) => (
            <Card
              key={item.name}
              className="rounded-lg p-4 mt-4"
              padding="lg"
              radius="md"
              withBorder
              style={{ width: "800px", height: "auto" }}
            >
              <Group align="center" style={{ height: "100%" }}>
                {item.imageURL && (
                  <img
                    src={item.imageURL}
                    alt={item.name}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      marginRight: 10,
                    }}
                    className="rounded"
                  />
                )}
                <Group
                  style={{ flexGrow: 1, justifyContent: "space-between" }}
                  className="px-12"
                >
                  <Text
                    className="flex-grow text-center truncate"
                    style={{ wordBreak: "break-word", marginRight: 10 }}
                  >
                    {item.name}
                  </Text>
                  <Text>{item.quantity}</Text>
                </Group>
                <Group>
                  <Button
                    color="green"
                    variant="light"
                    onClick={() => addItem(item)}
                  >
                    +
                  </Button>
                  <Button
                    color="orange"
                    variant="light"
                    onClick={() => removeItem(item)}
                  >
                    -
                  </Button>
                  <Button
                    color="red"
                    variant="light"
                    onClick={() => directRemoveItem(item)}
                  >
                    Remove
                  </Button>
                </Group>
              </Group>
            </Card>
          ))
        ) : (
          <Text className="text-neutral-400">
            Add an Item to Start Tracking 🍃
          </Text>
        )}
      </Stack>
    </>
  );
}
