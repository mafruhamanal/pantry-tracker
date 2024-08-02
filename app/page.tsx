import { Container } from '@mantine/core';

export default function Home() {

  const demoProps = {
    bg: 'var(--mantine-color-blue-light)',
    h: 200,
    mt: 'md',
  };

  return (
    <>
      <Container {...demoProps}>Base Setup</Container>
    </>
  );
}
