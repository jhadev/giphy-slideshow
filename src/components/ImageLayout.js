import React from 'react';
import { Flex, Box, Image, Button, Text, Link } from '@chakra-ui/core';

function ImageLayout({ selected, paused, setPaused, resize }) {
  return (
    <>
      <Text
        color="teal.500"
        fontSize="5xl"
        fontWeight="bold"
        textAlign="center">
        {selected.rank}.
      </Text>

      <Text
        color="white"
        fontSize="2xl"
        fontWeight="semibold"
        textAlign="center">
        {selected.title}
      </Text>
      <Flex mt={2} justify="center">
        <Box
          bg="pink.200"
          my={3}
          w={resize(selected.images.fixed_height.width)}
          p={4}
          color="white">
          <Flex justify="center">
            <Link isExternal href={selected.url}>
              <Image mx="auto" src={selected.images.fixed_height.url} />
            </Link>
          </Flex>
        </Box>
      </Flex>
      <Flex justify="center">
        <Button
          onClick={() => setPaused((paused) => !paused)}
          size="lg"
          variant="outline"
          variantColor="teal">
          {paused ? 'Resume' : 'Pause'}
        </Button>
      </Flex>
    </>
  );
}

export default ImageLayout;
