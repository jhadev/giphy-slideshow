import React from 'react';
import { Flex, Box, Image } from '@chakra-ui/core';

function ImageContainer({ gif, resize }) {
  return (
    <Box
      bg="pink.200"
      w={resize(gif.images.fixed_height.width)}
      p={4}
      m={2}
      color="white">
      <Flex justify="center">
        <Image src={gif.images.fixed_height.url} />
      </Flex>
    </Box>
  );
}

export default ImageContainer;
