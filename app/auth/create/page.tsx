"use client";

import {
  TextInput,
  PasswordInput,
  Checkbox,
  Paper,
  Anchor,
  Title,
  Container,
  Group,
  Button,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Updated import path
import { handleSignUp } from "./../../serverActions/authActions";
import classes from "./../../components/Auth.module.css";
import "./../../globals.css";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      await handleSignUp({ email, password, username });
      router.push("/"); // Redirect to home page upon successful sign-up
    } catch (err) {
      setError("Failed to sign up. Please try again.");
    }
  };

  return (
    <Container size={420} my={200}>
      <Text className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-green-100 mb-4 text-2xl text-center font-bold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-4xl">
        Let's Get You Started!
      </Text>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{" "}
        <Anchor size="sm" href="/auth/" className="text-green-500">
          Sign In
        </Anchor>
      </Text>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Username"
            placeholder="John Doe"
            required
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
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
            Sign up
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
