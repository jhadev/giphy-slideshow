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
import { gen, delay, isArray } from './utils/helpers';
import { useComponentDidMount } from './hooks/useComponentDidMount';
import ColorMode from './components/ColorMode';

function App() {
  const [gifs, setGifs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [genned, setGenned] = useState(null);
  const [paused, setPaused] = useState(false);

  const isMounted = useComponentDidMount();

  const getTrending = useCallback(async () => {
    try {
      const { data } = await client(
        `trending?limit=10&api_key=${process.env.REACT_APP_API_KEY}`
      );

      setGifs(data);
      setGenned(gen(data));
      console.log(genned);
    } catch (err) {
      console.log(err);
    }
  }, [genned]);

  useEffect(() => {
    getTrending();
  }, []);

  useEffect(() => {
    const { promise, timeOutId } = delay(3000);
    async function stepThrough() {
      console.log(timeOutId);
      // setId(timeOutId);

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
            <Box
              bg="tomato"
              w={`${selected.images.fixed_height.width}px`}
              p={4}
              color="white">
              <Flex justify="center">
                <Stack spacing={2}>
                  <Image src={selected.images.fixed_height.url} />
                  <Button
                    onClick={() => {
                      setPaused(!paused);
                    }}
                    size="lg"
                    variantColor="teal">
                    {paused ? 'Resume' : 'Pause'}
                  </Button>
                </Stack>
              </Flex>
            </Box>
          ) : selected && isArray(selected) ? (
            <Flex direction="row" wrap="wrap" justify="space-between">
              {selected.map((gif) => {
                return (
                  <Box
                    key={gif.id}
                    bg="tomato"
                    w={`${gif.images.fixed_height.width}px`}
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
            <Text fontSize="4xl">
              Trending Gifs on{' '}
              <Link color="teal.500" isExternal href="https://giphy.com">
                Giphy
              </Link>
            </Text>
          )}
        </Flex>
      </main>
    </ColorMode>
  );
}

export default App;
