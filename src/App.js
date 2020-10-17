import React, { useState, useEffect, useCallback } from 'react';
import {
  CSSReset,
  Flex,
  Box,
  Image,
  Button,
  Stack,
  Text,
  Link,
} from '@chakra-ui/core';
import { client } from './utils/API';
import { gen, delay, isArray, resize } from './utils/helpers';
import { useComponentDidMount } from './hooks/useComponentDidMount';
import ColorMode from './components/ColorMode';

function App() {
  const [gifs, setGifs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [genned, setGenned] = useState(null);
  const [paused, setPaused] = useState(true);

  const isMounted = useComponentDidMount();

  const getTrending = useCallback(
    async (params) => {
      try {
        const { data } = await client(params);

        setGifs(data);
        setGenned(gen(data));
      } catch (err) {
        console.log(err);
      }
    },
    [genned]
  );

  useEffect(() => {
    getTrending(`trending?limit=10&api_key=${process.env.REACT_APP_API_KEY}`);
  }, []);

  useEffect(() => {
    const { promise, timeOutId } = delay(3000);
    function stepThrough() {
      const next = genned.next().value;

      console.log(next);

      if (next) {
        setSelected(next);
      } else {
        setSelected(gifs);
      }
    }

    async function run() {
      if (isMounted && !paused) {
        await promise;
        stepThrough();
      } else {
        clearTimeout(timeOutId - 1);
      }
    }

    run();
  }, [selected, paused, genned]);

  return (
    <ColorMode>
      <CSSReset />

      <main className="container">
        <Flex
          h={isArray(selected) ? '100%' : '100vh'}
          align="center"
          justify="center">
          {selected && !isArray(selected) ? (
            <Stack spacing={4}>
              <Box
                bg="pink.200"
                w={resize(selected.images.fixed_height.width)}
                p={4}
                color="white">
                <Flex justify="center">
                  <Image src={selected.images.fixed_height.url} />
                </Flex>
              </Box>
              <Flex justify="center">
                <Button
                  onClick={() => setPaused((paused) => !paused)}
                  size="lg"
                  variant="outline"
                  variantColor="teal">
                  {paused ? 'Resume' : 'Pause'}
                </Button>
              </Flex>
            </Stack>
          ) : selected && isArray(selected) ? (
            <Flex m={2} direction="row" wrap="wrap" justify="center">
              {selected.map((gif) => {
                return (
                  <Box
                    key={gif.id}
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
              })}
            </Flex>
          ) : (
            <Stack spacing={10}>
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
                w="50%"
                variant={paused ? 'solid' : 'outline'}
                variantColor={paused ? 'teal' : 'pink'}>
                {paused ? 'Start' : 'Blasting Off!'}
              </Button>
            </Stack>
          )}
        </Flex>
      </main>
    </ColorMode>
  );
}

export default App;
