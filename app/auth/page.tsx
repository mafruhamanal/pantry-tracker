"use client";

import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleSignIn } from "./../serverActions/authActions";
import "./../globals.css";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      await handleSignIn({ email, password });
      router.push("/");
    } catch (err) {
      setError("Failed to sign in. Please try again.");
    }
  };

  return (
    <Container size={420} my={200}>
      <Text className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-green-100 mb-4 text-2xl text-center font-bold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-4xl">
        Welcome back!
      </Text>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor size="sm" href="/auth/create/" className="text-green-500">
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            placeholder="name@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          {error && (
            <Text color="red" mt="sm">
              {error}
            </Text>
          )}
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
          </Group>
          <Button
            fullWidth
            mt="xl"
            type="submit"
            variant="gradient"
            gradient={{ from: "lime", to: "teal", deg: 90 }}
          >
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
