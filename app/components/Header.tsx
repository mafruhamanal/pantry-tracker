"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { Container, Group, Burger, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Header.module.css";
import { handleSignOut } from "../serverActions/authActions"; // Import your sign-out function

const links = [{ link: "#", label: "Sign Out" }]; // Adjusted link for sign-out

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const router = useRouter(); // Initialize useRouter for navigation

  const handleSignOutClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    try {
      await handleSignOut();
      router.push("/auth/"); // Redirect to /auth/create after sign out
    } catch (error) {
      console.error("Sign out error:", error.message);
    }
  };

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={`${classes.link} ${
        active === link.link ? classes.active : ""
      }`}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        if (link.label === "Sign Out") {
          handleSignOutClick(event); // Handle sign-out click
        } else {
          event.preventDefault();
          setActive(link.link);
        }
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Text
          fw={600}
          className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-emerald-400 text-4xl text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-2xl"
        >
          Pantry Tracker App
        </Text>
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
