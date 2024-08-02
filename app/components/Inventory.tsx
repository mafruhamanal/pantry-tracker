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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import "./../globals.css";
interface InventoryItem {
  name: string;
  quantity: number;
}

interface InventoryProps {
  inventory: InventoryItem[];
  addItem: (item: string) => Promise<void>;
  removeItem: (item: string) => Promise<void>;
  directRemoveItem: (item: string) => Promise<void>;
  addNewItem: (item: string, quantities: number) => Promise<void>;
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
  const [opened, { open, close }] = useDisclosure(false);

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
              label="Quantity"
              placeholder="0"
              min={0}
              value={quantity}
              onChange={(value: number | string) =>
                setQuantity(typeof value === "number" ? value : 0)
              }
            />
            <Container className="flex justify-center">
              <Button
                color="pink"
                variant="light"
                mt="sm"
                onClick={async () => {
                  await addNewItem(itemName, quantity);
                  close();
                }}
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
          inventory.map(({ name, quantity }) => (
            <Stack key={name} justify="center" h={120} align="center">
              <Card
                key={name}
                className="rounded-lg p-4 mt-4"
                padding="lg"
                radius="md"
                withBorder
                style={{ width: "600px", height: "auto" }}
              >
                <Group align="center" style={{ height: "100%" }}>
                  <Group
                    style={{
                      flexGrow: 1,
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <Text
                      className="flex-grow text-center truncate"
                      style={{ wordBreak: "break-word" }}
                    >
                      {name}
                    </Text>
                    <Text ta="center" className="px-6">{`${quantity}`}</Text>
                  </Group>
                  <Group style={{ marginTop: "auto" }}>
                    <Button
                      color="green"
                      variant="light"
                      onClick={() => addItem(name)}
                    >
                      +
                    </Button>
                    <Button
                      color="orange"
                      variant="light"
                      onClick={() => removeItem(name)}
                    >
                      -
                    </Button>
                    <Button
                      color="red"
                      variant="light"
                      onClick={() => directRemoveItem(name)}
                    >
                      Remove
                    </Button>
                  </Group>
                </Group>
              </Card>
            </Stack>
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
