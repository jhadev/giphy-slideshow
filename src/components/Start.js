import React from 'react';
import { Button, Text, Link } from '@chakra-ui/core';

function Start({ paused, setPaused }) {
  return (
    <>
      <Text fontSize="5xl">
        Trending Gifs on{' '}
        <Link
          color={paused ? 'teal.500' : 'pink.500'}
          isExternal
          href="https://giphy.com">
          Giphy
        </Link>
      </Text>
      <Button
        onClick={() => setPaused((paused) => !paused)}
        size="lg"
        marginX="auto"
        mt={5}
        w="50%"
        variant={paused ? 'solid' : 'outline'}
        variantColor={paused ? 'teal' : 'pink'}>
        {paused ? 'Start' : 'Blasting Off!'}
      </Button>
    </>
  );
}

export default Start;
