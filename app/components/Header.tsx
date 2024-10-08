"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Group,
  Burger,
  Text,
  Paper,
  Transition,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Header.module.css";
import { handleSignOut } from "../serverActions/authActions";

const links = [{ link: "#", label: "Sign Out" }];

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const router = useRouter();

  const handleSignOutClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    try {
      await handleSignOut();
      router.push("/auth/");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Sign out error:", error.message);
      } else {
        console.error("Sign out error:", error);
      }
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
          handleSignOutClick(event);
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
          className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-emerald-400 text-xl text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-2xl"
        >
          Pantry Tracker App
        </Text>
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
        <Transition transition="fade-left" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.burgerMenu} style={styles} withBorder>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </header>
  );
}
